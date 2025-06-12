/**
 * Complete Migration script to populate the new-students collection in Firebase
 * This script extracts student data from the TypeScript file and migrates it to Firebase
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Extract student data from the TypeScript file
 */
function extractStudentData() {
  try {
    const filePath = path.join(__dirname, '../data/student-data.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the studentDatabase array using regex
    const arrayMatch = fileContent.match(/export const studentDatabase: StudentData\[\] = \[([\s\S]*?)\];/);
    if (!arrayMatch) {
      throw new Error('Could not find studentDatabase array in file');
    }
    
    const arrayContent = arrayMatch[1];
    
    // Parse the array content to extract student objects
    const studentMatches = arrayContent.match(/\{ regNumber: "[^"]+", name: "[^"]+", surname: "[^"]+", gender: "[^"]+", programme: "[^"]+", part: "[^"]+" \}/g);
    
    if (!studentMatches) {
      throw new Error('Could not parse student objects from array');
    }
    
    const students = studentMatches.map(match => {
      const regNumberMatch = match.match(/regNumber: "([^"]+)"/);
      const nameMatch = match.match(/name: "([^"]+)"/);
      const surnameMatch = match.match(/surname: "([^"]+)"/);
      const genderMatch = match.match(/gender: "([^"]+)"/);
      const programmeMatch = match.match(/programme: "([^"]+)"/);
      const partMatch = match.match(/part: "([^"]+)"/);
      
      if (!regNumberMatch || !nameMatch || !surnameMatch || !genderMatch || !programmeMatch || !partMatch) {
        console.warn('Skipping malformed student object:', match);
        return null;
      }
      
      return {
        regNumber: regNumberMatch[1],
        name: nameMatch[1],
        surname: surnameMatch[1],
        gender: genderMatch[1],
        programme: programmeMatch[1],
        part: partMatch[1]
      };
    }).filter(Boolean);
    
    console.log(`Successfully extracted ${students.length} students from TypeScript file`);
    return students;
  } catch (error) {
    console.error('Error extracting student data:', error);
    return [];
  }
}

/**
 * Migrate student data from TypeScript file to Firebase collection
 */
async function migrateStudentData() {
  console.log('🔥 Starting student data migration...');
  
  try {
    // Extract student data from TypeScript file
    const studentDatabase = extractStudentData();
    
    if (studentDatabase.length === 0) {
      console.error('No student data found to migrate');
      return;
    }
    
    console.log(`Total students to migrate: ${studentDatabase.length}`);

    // Check if collection already has data
    const newStudentsCollection = collection(db, 'new-students');
    const existingDocs = await getDocs(newStudentsCollection);
    
    if (existingDocs.size > 0) {
      console.log(`Collection already contains ${existingDocs.size} documents.`);
      const proceed = await confirmProceed();
      if (!proceed) {
        console.log('Migration cancelled.');
        return;
      }
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Migrate each student
    for (const student of studentDatabase) {
      try {
        const studentDoc = doc(db, 'new-students', student.regNumber);
        
        // Add metadata to the student record
        const studentData = {
          ...student,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),

        };

        await setDoc(studentDoc, studentData);
        successCount++;
        
        if (successCount % 50 === 0) {
          console.log(`Migrated ${successCount} students...`);
        }
      } catch (error) {
        errorCount++;
        errors.push({
          regNumber: student.regNumber,
          name: `${student.name} ${student.surname}`,
          error: error.message
        });
        console.error(`Error migrating ${student.regNumber}:`, error.message);
      }
    }

    // Summary
    console.log('\n=== Migration Summary ===');
    console.log(`Total processed: ${studentDatabase.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach(error => {
        console.log(`- ${error.regNumber} (${error.name}): ${error.error}`);
      });
    }

    if (successCount > 0) {
      console.log('\n✅ Migration completed successfully!');
      console.log('Students have been migrated to the "new-students" collection.');
      console.log('You can now update your application to use the new collection.');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Verify the migration by checking a sample of records
 */
async function verifyMigration() {
  console.log('\nVerifying migration...');
  
  try {
    const newStudentsCollection = collection(db, 'new-students');
    const snapshot = await getDocs(newStudentsCollection);
    
    console.log(`Found ${snapshot.size} documents in new-students collection`);
    
    // Sample verification - check first 5 records
    const sampleDocs = snapshot.docs.slice(0, Math.min(5, snapshot.docs.length));
    let verifiedCount = 0;
    
    console.log('\nSample records:');
    sampleDocs.forEach(doc => {
      const data = doc.data();
      console.log(`- ${doc.id}: ${data.name} ${data.surname} (${data.gender}, ${data.programme})`);
      
      if (data.name && data.surname && data.gender && data.programme && data.part) {
        verifiedCount++;
      }
    });
    
    console.log(`✅ Verified ${verifiedCount}/${sampleDocs.length} sample records have complete data`);
    
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

/**
 * Utility function to confirm user wants to proceed
 */
async function confirmProceed() {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Do you want to proceed with the migration? (y/N): ', (answer) => {
      readline.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Check Firebase connection and environment
 */
async function checkEnvironment() {
  console.log('🔍 Checking environment and Firebase connection...');
  
  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    console.error('\nPlease check your .env.local file');
    return false;
  }
  
  // Test Firebase connection
  try {
    const testCollection = collection(db, 'new-students');
    await getDocs(testCollection);
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔥 Firebase Student Data Migration Tool');
  console.log('=======================================\n');
  
  try {
    // Check environment first
    const envOk = await checkEnvironment();
    if (!envOk) {
      process.exit(1);
    }
    
    await migrateStudentData();
    await verifyMigration();
    
    console.log('\n🎉 Migration process completed!');
    console.log('\nNext steps:');
    console.log('1. Update your application code to use the firebase-student-data.ts functions');
    console.log('2. Test the student lookup functionality');
    console.log('3. Monitor the application logs for any issues');
    
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the migration if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  migrateStudentData,
  verifyMigration,
  extractStudentData
};
