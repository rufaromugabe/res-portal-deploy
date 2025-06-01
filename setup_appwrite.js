const sdk = require('node-appwrite');

// Helper to construct permission strings
const Permission = sdk.Permission;
const Role = sdk.Role;

async function setupAppwrite() {
    try {
        const client = new sdk.Client();
        const databases = new sdk.Databases(client);

        const endpoint = process.env.APPWRITE_ENDPOINT;
        const projectId = process.env.APPWRITE_PROJECT_ID;
        const apiKey = process.env.APPWRITE_API_KEY;
        const databaseId = process.env.APPWRITE_DATABASE_ID || 'default';

        if (!endpoint || !projectId || !apiKey) {
            console.error("Missing required environment variables: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY");
            process.exit(1);
        }
        if (!databaseId) {
            console.error("Missing required environment variable: APPWRITE_DATABASE_ID");
            process.exit(1);
        }


        client
            .setEndpoint(endpoint)
            .setProject(projectId)
            .setKey(apiKey);

        console.log(`Using Database ID: ${databaseId}`);

        async function createCollectionWithAttributesAndIndexes(collectionDetails) {
            const { collectionId, collectionName, permissions, attributes, indexes } = collectionDetails;
            try {
                await databases.createCollection(databaseId, collectionId, collectionName, permissions, true);
                console.log(`Collection '${collectionName}' (${collectionId}) created successfully.`);
            } catch (e) {
                if (e.message.toLowerCase().includes("collection_already_exists") || e.message.toLowerCase().includes("already exists")) {
                    console.warn(`Collection '${collectionName}' (${collectionId}) already exists. Skipping creation.`);
                } else {
                    console.error(`Error creating collection '${collectionName}' (${collectionId}):`, e.message);
                    return; // Stop if collection creation fails and it's not "already exists"
                }
            }

            for (const attr of attributes) {
                try {
                    switch (attr.type) {
                        case 'string':
                            await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, attr.required, attr.default, attr.array);
                            break;
                        case 'integer':
                            await databases.createIntegerAttribute(databaseId, collectionId, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
                            break;
                        case 'float':
                            await databases.createFloatAttribute(databaseId, collectionId, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
                            break;
                        case 'boolean':
                            await databases.createBooleanAttribute(databaseId, collectionId, attr.key, attr.required, attr.default, attr.array);
                            break;
                        case 'datetime':
                            await databases.createDatetimeAttribute(databaseId, collectionId, attr.key, attr.required, attr.default, attr.array);
                            break;
                        default:
                            console.warn(`Unknown attribute type: ${attr.type} for attribute ${attr.key}`);
                            continue;
                    }
                    console.log(`Attribute '${attr.key}' for collection '${collectionName}' created successfully.`);
                } catch (e) {
                    if (e.message.toLowerCase().includes("attribute_already_exists") || e.message.toLowerCase().includes("already exists")) {
                        console.warn(`Attribute '${attr.key}' in collection '${collectionName}' already exists. Skipping.`);
                    } else {
                        console.error(`Error creating attribute '${attr.key}' in '${collectionName}':`, e.message);
                    }
                }
            }

            // Wait for attributes to be processed by Appwrite.
            // This is crucial before creating indexes.
            console.log(`Waiting for attributes in ${collectionName} to be processed...`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Increased wait time

            for (const index of indexes) {
                try {
                    await databases.createIndex(databaseId, collectionId, index.key, index.type, index.attributes, index.orders || []);
                    console.log(`Index '${index.key}' for collection '${collectionName}' created successfully.`);
                } catch (e) {
                     if (e.message.toLowerCase().includes("index_already_exists") || e.message.toLowerCase().includes("already exists")) {
                        console.warn(`Index '${index.key}' in collection '${collectionName}' already exists. Skipping.`);
                    } else {
                        console.error(`Error creating index '${index.key}' in '${collectionName}':`, e.message);
                    }
                }
            }
        }

        // Define admin role assuming a team 'admins' exists or will be created.
        // For user-specific document access, permissions are set on document creation.
        // Collection level permissions are broader.
        const adminTeamRoleRead = Permission.read(Role.team("admins"));
        const adminTeamRoleCreate = Permission.create(Role.team("admins"));
        const adminTeamRoleUpdate = Permission.update(Role.team("admins"));
        const adminTeamRoleDelete = Permission.delete(Role.team("admins"));
        const anyRead = Permission.read(Role.any());
        const usersCreate = Permission.create(Role.users());
        const usersRead = Permission.read(Role.users());


        const collectionsToCreate = [
            {
                collectionId: 'users',
                collectionName: 'Users',
                permissions: [usersCreate, adminTeamRoleRead, adminTeamRoleUpdate, adminTeamRoleDelete],
                attributes: [
                    // userId is $id, createdAt is $createdAt
                    { key: 'email', type: 'string', size: 255, required: true },
                    { key: 'displayName', type: 'string', size: 255, required: false },
                    { key: 'role', type: 'string', size: 50, required: true }, // e.g., 'user', 'admin'
                ],
                indexes: [
                    { key: 'idx_email', type: 'key', attributes: ['email'] }
                ]
            },
            {
                collectionId: 'applications',
                collectionName: 'Applications',
                permissions: [usersCreate, usersRead, adminTeamRoleUpdate, adminTeamRoleDelete],
                attributes: [
                    { key: 'regNumber', type: 'string', size: 255, required: true }, // Primary candidate
                    { key: 'name', type: 'string', size: 255, required: true },
                    { key: 'gender', type: 'string', size: 50, required: true },
                    { key: 'programme', type: 'string', size: 255, required: true },
                    { key: 'part', type: 'integer', required: true },
                    { key: 'preferredHostel', type: 'string', size: 255, required: true },
                    { key: 'email', type: 'string', size: 255, required: true },
                    { key: 'phone', type: 'string', size: 50, required: true },
                    { key: 'status', type: 'string', size: 50, required: true }, // e.g., 'Pending', 'Accepted', 'Archived'
                    { key: 'submittedAt', type: 'datetime', required: true },
                    { key: 'paymentStatus', type: 'string', size: 50, required: true },
                    { key: 'reference', type: 'string', size: 255, required: false },
                ],
                indexes: [
                    { key: 'idx_regNumber_applications', type: 'key', attributes: ['regNumber'], orders: ['ASC'] },
                    { key: 'idx_email_applications', type: 'key', attributes: ['email'], orders: ['ASC'] },
                    { key: 'idx_status_applications', type: 'key', attributes: ['status'], orders: ['ASC'] },
                ]
            },
            {
                collectionId: 'hostels',
                collectionName: 'Hostels',
                permissions: [anyRead, adminTeamRoleCreate, adminTeamRoleUpdate, adminTeamRoleDelete],
                attributes: [
                    { key: 'name', type: 'string', size: 255, required: true },
                    { key: 'description', type: 'string', size: 1000, required: true },
                    { key: 'totalCapacity', type: 'integer', required: true },
                    { key: 'currentOccupancy', type: 'integer', required: true },
                    { key: 'gender', type: 'string', size: 50, required: true }, // e.g., 'Male', 'Female', 'Mixed'
                    { key: 'isActive', type: 'boolean', required: true, default: true },
                    { key: 'pricePerSemester', type: 'float', required: true },
                    { key: 'features', type: 'string', size: 255, required: false, array: true }, // Max item size 255
                    { key: 'images', type: 'string', size: 255, required: false, array: true }, // Max item size 255 for URLs
                ],
                indexes: [
                    { key: 'idx_name_hostels', type: 'key', attributes: ['name'], orders: ['ASC'] },
                    { key: 'idx_gender_hostels', type: 'key', attributes: ['gender'], orders: ['ASC'] },
                    { key: 'idx_isActive_hostels', type: 'key', attributes: ['isActive'], orders: ['ASC'] },
                ]
            },
            {
                collectionId: 'floors',
                collectionName: 'Floors',
                permissions: [usersRead, adminTeamRoleCreate, adminTeamRoleUpdate, adminTeamRoleDelete],
                attributes: [
                    { key: 'hostelId', type: 'string', size: 255, required: true }, // Relationship
                    { key: 'number', type: 'string', size: 50, required: true },
                    { key: 'name', type: 'string', size: 255, required: true },
                ],
                indexes: [
                    { key: 'idx_hostelId_floors', type: 'key', attributes: ['hostelId'], orders: ['ASC'] },
                ]
            },
            {
                collectionId: 'rooms',
                collectionName: 'Rooms',
                permissions: [usersRead, adminTeamRoleCreate, adminTeamRoleUpdate, adminTeamRoleDelete],
                attributes: [
                    { key: 'floorId', type: 'string', size: 255, required: true }, // Relationship
                    { key: 'hostelId', type: 'string', size: 255, required: true }, // Denormalized/Relationship
                    { key: 'number', type: 'string', size: 50, required: true },
                    { key: 'price', type: 'float', required: true },
                    { key: 'capacity', type: 'integer', required: true },
                    { key: 'occupants', type: 'string', size: 255, required: false, array: true }, // student regNumbers
                    { key: 'gender', type: 'string', size: 50, required: true },
                    { key: 'isReserved', type: 'boolean', required: true, default: false },
                    { key: 'reservedBy', type: 'string', size: 255, required: false }, // admin email
                    { key: 'reservedUntil', type: 'datetime', required: false },
                    { key: 'isAvailable', type: 'boolean', required: true, default: true },
                    { key: 'features', type: 'string', size: 255, required: false, array: true },
                    { key: 'paymentDeadline', type: 'datetime', required: false },
                    { key: 'floorName', type: 'string', size: 255, required: false }, // Denormalized
                    { key: 'hostelName', type: 'string', size: 255, required: false }, // Denormalized
                ],
                indexes: [
                    { key: 'idx_floorId_rooms', type: 'key', attributes: ['floorId'], orders: ['ASC'] },
                    { key: 'idx_hostelId_rooms', type: 'key', attributes: ['hostelId'], orders: ['ASC'] },
                    { key: 'idx_isAvailable_rooms', type: 'key', attributes: ['isAvailable'], orders: ['ASC'] },
                    { key: 'idx_gender_rooms', type: 'key', attributes: ['gender'], orders: ['ASC'] },
                    { key: 'idx_isReserved_rooms', type: 'key', attributes: ['isReserved'], orders: ['ASC'] },
                ]
            },
            {
                collectionId: 'payments',
                collectionName: 'Payments',
                permissions: [usersCreate, usersRead, adminTeamRoleUpdate, adminTeamRoleDelete],
                attributes: [
                    { key: 'studentRegNumber', type: 'string', size: 255, required: true },
                    { key: 'allocationId', type: 'string', size: 255, required: true }, // Relationship
                    { key: 'receiptNumber', type: 'string', size: 255, required: true },
                    { key: 'amount', type: 'float', required: true },
                    { key: 'paymentMethod', type: 'string', size: 100, required: true },
                    { key: 'submittedAt', type: 'datetime', required: true },
                    { key: 'status', type: 'string', size: 50, required: true }, // 'Pending', 'Approved', 'Rejected'
                    { key: 'approvedBy', type: 'string', size: 255, required: false }, // admin email
                    { key: 'approvedAt', type: 'datetime', required: false },
                    { key: 'rejectionReason', type: 'string', size: 1000, required: false },
                    { key: 'attachments', type: 'string', size: 255, required: false, array: true }, // URLs
                    { key: 'notes', type: 'string', size: 1000, required: false },
                ],
                indexes: [
                    { key: 'idx_studentRegNumber_payments', type: 'key', attributes: ['studentRegNumber'], orders: ['ASC'] },
                    { key: 'idx_status_payments', type: 'key', attributes: ['status'], orders: ['ASC'] },
                    { key: 'idx_submittedAt_payments', type: 'key', attributes: ['submittedAt'], orders: ['ASC'] },
                    { key: 'idx_allocationId_payments', type: 'key', attributes: ['allocationId'], orders: ['ASC'] },
                ]
            },
            {
                collectionId: 'roomAllocations',
                collectionName: 'RoomAllocations',
                permissions: [usersRead, adminTeamRoleCreate, adminTeamRoleUpdate, adminTeamRoleDelete],
                attributes: [
                    { key: 'studentRegNumber', type: 'string', size: 255, required: true },
                    { key: 'roomId', type: 'string', size: 255, required: true }, // Relationship
                    { key: 'hostelId', type: 'string', size: 255, required: true }, // Relationship
                    { key: 'allocatedAt', type: 'datetime', required: true },
                    { key: 'paymentStatus', type: 'string', size: 50, required: true }, // 'Pending', 'Paid', 'Overdue'
                    { key: 'paymentDeadline', type: 'datetime', required: true },
                    { key: 'semester', type: 'string', size: 100, required: true },
                    { key: 'academicYear', type: 'string', size: 50, required: true },
                    { key: 'paymentId', type: 'string', size: 255, required: false }, // Relationship
                ],
                indexes: [
                    { key: 'idx_studentRegNumber_ra', type: 'key', attributes: ['studentRegNumber'], orders: ['ASC'] },
                    { key: 'idx_roomId_ra', type: 'key', attributes: ['roomId'], orders: ['ASC'] },
                    { key: 'idx_hostelId_ra', type: 'key', attributes: ['hostelId'], orders: ['ASC'] },
                    { key: 'idx_paymentStatus_ra', type: 'key', attributes: ['paymentStatus'], orders: ['ASC'] },
                    { key: 'idx_paymentDeadline_ra', type: 'key', attributes: ['paymentDeadline'], orders: ['ASC'] },
                ]
            },
            {
                collectionId: 'settings', // Singleton, use a known document ID e.g., 'currentSettings'
                collectionName: 'Settings',
                permissions: [anyRead, adminTeamRoleUpdate, adminTeamRoleDelete], // Delete for resetting
                attributes: [
                    { key: 'paymentGracePeriod', type: 'integer', required: true }, // in days
                    { key: 'autoRevokeUnpaidAllocations', type: 'boolean', required: true },
                    { key: 'maxRoomCapacity', type: 'integer', required: true },
                    { key: 'allowMixedGenderRooms', type: 'boolean', required: true, default: false }, // Corrected name
                ],
                indexes: [] // No indexes needed for a singleton usually
            }
        ];

        for (const coll of collectionsToCreate) {
            await createCollectionWithAttributesAndIndexes(coll);
        }

        console.log("\nAppwrite setup script finished.");
        console.log("Please ensure you have an 'admins' team created in your Appwrite project for admin permissions to work correctly.");
        console.log("For 'users' and 'applications' collections, document-level permissions will need to be set when creating/updating documents to restrict access for non-admin users to their own data.");

    } catch (error) {
        console.error("\nFailed to complete Appwrite setup:", error);
        process.exit(1);
    }
}

setupAppwrite();
