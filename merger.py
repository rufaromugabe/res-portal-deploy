import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import sys
from collections import defaultdict
from typing import Dict, List, Any

# Load environment variables
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
    
    if service_account_path and os.path.exists(service_account_path):
        print(f"🔑 Using service account: {service_account_path}")
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    else:
        print("⚠️  Service account not found, trying with project ID only...")
        firebase_admin.initialize_app(options={
            'projectId': os.getenv('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
        })
    
    return firestore.client()

def get_all_hostels(db):
    """Fetch all hostels from the database."""
    hostels_ref = db.collection("hostels")
    hostels = {}
    
    print("🔍 Fetching hostels from database...")
    for doc in hostels_ref.stream():
        hostels[doc.id] = doc.to_dict()
        hostels[doc.id]['id'] = doc.id  # Store ID within the hostel object for convenience
    
    print(f"📊 Found {len(hostels)} hostels")
    
    # Display hostel information in a table format
    if hostels:
        print("\nHostel Details:")
        for hostel_id, hostel in hostels.items():
            occupant_count = count_hostel_occupants(hostel)
            hostel['occupant_count'] = occupant_count  # Store for later use
            print(f"  - {hostel.get('name', 'Unnamed')} (ID: {hostel_id[:8]}...): {occupant_count} occupants")
    
    return hostels

def count_hostel_occupants(hostel):
    """Count the total number of students in a hostel."""
    count = 0
    for floor in hostel.get('floors', []):
        for room in floor.get('rooms', []):
            count += len(room.get('occupants', []))
    return count

def identify_duplicate_hostels(hostels):
    """Group hostels by name to identify duplicates."""
    hostel_groups = defaultdict(list)
    
    # Group hostels by name
    for hostel_id, hostel in hostels.items():
        name = hostel.get('name', 'Unnamed')
        hostel_groups[name].append(hostel_id)
    
    # Filter out non-duplicates (groups with only one hostel)
    duplicate_groups = {name: ids for name, ids in hostel_groups.items() if len(ids) > 1}
    
    print("\n🔍 Scanning for duplicate hostels...")
    if duplicate_groups:
        print(f"✅ Found {len(duplicate_groups)} groups of duplicate hostels:")
        for name, ids in duplicate_groups.items():
            print(f"  - '{name}': {len(ids)} instances")
    else:
        print("ℹ️ No duplicate hostels found.")
    
    return duplicate_groups

def find_primary_hostel_in_group(hostels, hostel_ids):
    """Find the hostel with the most occupants within a group."""
    primary_id = None
    max_occupants = -1
    
    for hostel_id in hostel_ids:
        occupant_count = hostels[hostel_id].get('occupant_count', 0)
        
        if occupant_count > max_occupants:
            max_occupants = occupant_count
            primary_id = hostel_id
    
    primary_hostel = hostels[primary_id]
    print(f"🏠 Primary hostel selected: {primary_hostel.get('name')} (ID: {primary_id[:8]}...) "
          f"with {primary_hostel.get('occupant_count')} occupants")
            
    return primary_id

def get_room_by_number(hostel, room_number):
    """Find a room in a hostel by its number."""
    for floor in hostel.get('floors', []):
        for room in floor.get('rooms', []):
            if room.get('number') == room_number:
                return room
    return None

def merge_hostel_group(primary_id, hostel_ids, hostels):
    """Merge a group of duplicate hostels into the primary hostel."""
    primary_hostel = hostels[primary_id]
    primary_name = primary_hostel.get('name')
    
    merge_results = {
        'successful_merges': 0,
        'conflicts': 0,
        'completely_merged': [],
        'partially_merged': []
    }
    
    print(f"\n🔄 Starting merge for '{primary_name}' group with primary (ID: {primary_id[:8]}...)")
    
    # For each non-primary hostel in this group
    for hostel_id in hostel_ids:
        if hostel_id == primary_id:
            continue
            
        hostel = hostels[hostel_id]
        print(f"\nProcessing: {hostel.get('name')} (ID: {hostel_id[:8]}...)")
        
        # Track whether this hostel can be completely merged
        remaining_occupants = hostel['occupant_count']
        conflicts = False
        
        # Print table header for affected rooms
        print("\n┌─────────┬─────────────────┬─────────────────┬────────────┬──────────────────┐")
        print("│ Room #  │ Source Occupants │ Target Occupants │ Capacity   │ Status           │")
        print("├─────────┼─────────────────┼─────────────────┼────────────┼──────────────────┤")
        
        # For each floor in the non-primary hostel
        for floor in hostel.get('floors', []):
            # For each room in the floor
            for room in floor.get('rooms', []):
                room_number = room.get('number')
                room_occupants = room.get('occupants', [])
                
                if not room_occupants:
                    continue  # Skip empty rooms
                
                # Find corresponding room in primary hostel
                primary_room = get_room_by_number(primary_hostel, room_number)
                
                if primary_room is None:
                    conflicts = True
                    status = "❌ No matching room"
                    print(f"│ {room_number:7} │ {len(room_occupants):15} │ {'-':15} │ {'-':10} │ {status:16} │")
                    merge_results['conflicts'] += 1
                    continue
                
                # Check if merging would exceed capacity
                primary_occupants = primary_room.get('occupants', [])
                capacity = primary_room.get('capacity', 0)
                
                if len(primary_occupants) + len(room_occupants) <= capacity:
                    # Merge is possible - add students to primary
                    for student in room_occupants:
                        if student not in primary_occupants:
                            primary_occupants.append(student)
                    
                    primary_room['occupants'] = primary_occupants
                    primary_room['isAvailable'] = len(primary_occupants) < capacity
                    
                    # Clear the room in the secondary hostel
                    room['occupants'] = []
                    room['isAvailable'] = True
                    
                    remaining_occupants -= len(room_occupants)
                    merge_results['successful_merges'] += len(room_occupants)
                    
                    status = "✅ Merged"
                    print(f"│ {room_number:7} │ {len(room_occupants):15} │ {len(primary_occupants):15} │ {capacity:10} │ {status:16} │")
                else:
                    # Conflict - can't merge this room
                    conflicts = True
                    merge_results['conflicts'] += 1
                    
                    status = "❌ Capacity exceeded"
                    print(f"│ {room_number:7} │ {len(room_occupants):15} │ {len(primary_occupants)}/{capacity:8} │ {capacity:10} │ {status:16} │")
        
        print("└─────────┴─────────────────┴─────────────────┴────────────┴──────────────────┘")
        
        # Check if hostel was completely merged
        if remaining_occupants == 0 and not conflicts:
            merge_results['completely_merged'].append(hostel_id)
            print(f"  ✅ Result: COMPLETELY MERGED")
        elif remaining_occupants < hostel['occupant_count']:
            merge_results['partially_merged'].append(hostel_id)
            print(f"  ⚠️ Result: PARTIALLY MERGED")
        else:
            print(f"  ❌ Result: NOT MERGED")
    
    return merge_results

def display_group_merge_summary(merge_results, hostels, primary_id, group_name):
    """Display a summary of the merge results for a group"""
    print("\n" + "-"*60)
    print(f"📊 MERGE SUMMARY FOR '{group_name}'")
    print("-"*60)
    
    print(f"\n✅ Successfully merged {merge_results['successful_merges']} students")
    print(f"❌ Encountered {merge_results['conflicts']} room conflicts")
    
    print("\nHostel Status:")
    # First show primary hostel
    print(f"  🏠 {hostels[primary_id].get('name')} (ID: {primary_id[:8]}...): PRIMARY HOSTEL")
    
    # Then show all other hostels in this group
    for hostel_id in [hid for hid in hostels.keys() if hostels[hid].get('name') == group_name and hid != primary_id]:
        status = "COMPLETELY MERGED" if hostel_id in merge_results['completely_merged'] else \
                "PARTIALLY MERGED" if hostel_id in merge_results['partially_merged'] else "NOT MERGED"
        
        icon = "✅" if status == "COMPLETELY MERGED" else "⚠️" if status == "PARTIALLY MERGED" else "❌"
        will_delete = "Yes" if hostel_id in merge_results['completely_merged'] else "No"
        
        print(f"  {icon} {hostels[hostel_id].get('name')} (ID: {hostel_id[:8]}...): {status}, Will Delete: {will_delete}")

def update_hostels_for_group(db, hostels, merge_results, batch=None):
    """Update the hostels in the database for a group.
    Uses an existing batch if provided, otherwise creates a new one."""
    
    # Create a new batch if one wasn't provided
    if batch is None:
        batch = db.batch()
        commit_batch = True
    else:
        commit_batch = False
    
    # Track operations
    operations = {
        'updated': [],
        'to_delete': []
    }
    
    # First, update the primary hostel and any partially merged hostels
    for hostel_id, hostel in hostels.items():
        if hostel_id not in merge_results['completely_merged']:
            hostel_ref = db.collection("hostels").document(hostel_id)
            # Remove the 'id' field before updating
            hostel_data = {k: v for k, v in hostel.items() if k != 'id'}
            batch.update(hostel_ref, hostel_data)
            operations['updated'].append(hostel.get('name', 'Unnamed'))
    
    # Mark completely merged hostels for deletion
    for hostel_id in merge_results['completely_merged']:
        hostel_ref = db.collection("hostels").document(hostel_id)
        batch.delete(hostel_ref)
        operations['to_delete'].append(hostels[hostel_id].get('name', 'Unnamed'))
    
    # If we created the batch here, commit it
    if commit_batch:
        batch.commit()
    
    return operations, batch

def update_student_allocations(db, merge_results, primary_id, hostels, batch=None):
    """Update student hostel allocations records after merging hostels.
    
    Args:
        db: Firestore database instance
        merge_results: Dictionary containing merge operation results
        primary_id: ID of the primary hostel
        hostels: Dictionary of all hostels
        batch: Optional existing batch operation
    
    Returns:
        tuple: (updated_count, batch)
    """
    # Get completely merged hostels
    merged_hostels = merge_results['completely_merged']
    if not merged_hostels:
        print("ℹ️ No allocation updates needed - no hostels were completely merged")
        return 0, batch
    
    # Set up tracking
    updated_count = 0
    errors = 0
    
    print("\n🔄 Processing student allocations...")
    print(f"   Primary hostel: {hostels[primary_id]['name']} ({primary_id[:8]}...)")
    
    # For each merged hostel
    for hostel_id in merged_hostels:
        hostel_name = hostels[hostel_id]['name']
        print(f"\n   📍 Processing {hostel_name} ({hostel_id[:8]}...)")
        
        try:
            # Get all allocations for this hostel
            alloc_query = db.collection("roomAllocations").where("hostelId", "==", hostel_id)
            allocations = list(alloc_query.stream())
            
            print(f"      Found {len(allocations)} allocations to update")
            
            if not allocations:
                print(f"      ⚠️ No allocations found")
                continue
            
            # Process each allocation individually (like changeRoomAllocation does)
            for alloc in allocations:
                try:
                    alloc_data = alloc.to_dict()
                    student_reg = alloc_data.get('studentRegNumber', '')
                    room_id = alloc_data.get('roomId', '')
                    
                    # Basic validation
                    if not all([student_reg, room_id]):
                        print(f"      ⚠️ Skipping invalid allocation {alloc.id}")
                        continue
                    
                    # Update allocation document with specific fields (like changeRoomAllocation)
                    alloc_ref = db.collection("roomAllocations").document(alloc.id)
                    
                    # Use the same approach as changeRoomAllocation - update specific fields
                    from firebase_admin import firestore as admin_firestore
                    alloc_ref.update({
                        'hostelId': primary_id,
                    })
                    
                    updated_count += 1
                    print(f"      ✓ Student {student_reg}: Room {room_id}")
                    
                except Exception as e:
                    errors += 1
                    print(f"      ❌ Failed to update allocation {alloc.id}: {str(e)}")
                    
        except Exception as e:
            print(f"   ❌ Error processing hostel {hostel_id}: {str(e)}")
            continue
    
    # Print summary
    print(f"\n📊 Allocation updates summary:")
    print(f"   ✅ {updated_count} allocations updated immediately")
    if errors > 0:
        print(f"   ⚠️ {errors} errors encountered")
    
    return updated_count, batch

def validate_and_fix_allocation_hostel_ids(db, hostels, merge_mapping):
    """
    Validate and fix hostel IDs in room allocations after merging.
    Checks that all room allocations have correct hostel IDs and updates mismatched ones.
    
    Args:
        db: Firestore database instance
        hostels: Dictionary of all current hostels after merging
        merge_mapping: Dictionary mapping old hostel IDs to primary hostel IDs
    
    Returns:
        dict: Summary of validation and fixes
    """
    print("\n🔍 Validating hostel IDs in room allocations...")
    
    validation_results = {
        'total_allocations': 0,
        'valid_allocations': 0,
        'invalid_allocations': 0,
        'fixed_allocations': 0,
        'orphaned_allocations': 0,
        'errors': 0,
        'issues': [],
        'fixes': []
    }
    
    try:
        # Get all room allocations
        allocations_ref = db.collection("roomAllocations")
        all_allocations = list(allocations_ref.stream())
        validation_results['total_allocations'] = len(all_allocations)
        
        print(f"📊 Found {len(all_allocations)} total room allocations to validate")
        
        if not all_allocations:
            print("ℹ️ No allocations found to validate")
            return validation_results
        
        # Get list of valid hostel IDs (after merging)
        valid_hostel_ids = set(hostels.keys())
        
        # Create a map of student registration numbers to their actual hostel locations
        student_to_hostel_map = {}
        
        print("🗺️ Building student-to-hostel map from room occupants...")
        for hostel_id, hostel in hostels.items():
            for floor in hostel.get('floors', []):
                for room in floor.get('rooms', []):
                    for student_reg in room.get('occupants', []):
                        student_to_hostel_map[student_reg] = {
                            'hostel_id': hostel_id,
                            'hostel_name': hostel.get('name', 'Unknown'),
                            'room_id': room.get('id', ''),
                            'room_number': room.get('number', '')
                        }
        
        print(f"   📋 Built map with {len(student_to_hostel_map)} student entries")
        
        # Track allocations that need fixing
        allocations_to_fix = []
        allocations_to_delete = []
        
        print("\n┌─────────────────┬─────────────────┬─────────────────┬──────────────────┐")
        print("│ Student RegNo   │ Current Hostel  │ Correct Hostel  │ Status           │")
        print("├─────────────────┼─────────────────┼─────────────────┼──────────────────┤")
        
        for alloc_doc in all_allocations:
            try:
                alloc_data = alloc_doc.to_dict()
                alloc_id = alloc_doc.id
                student_reg = alloc_data.get('studentRegNumber', 'N/A')
                current_hostel_id = alloc_data.get('hostelId', '')
                room_id = alloc_data.get('roomId', '')
                
                # Check if current hostel ID exists in valid hostels
                if current_hostel_id in valid_hostel_ids:
                    # Hostel ID is valid, but verify student is actually in this hostel
                    actual_location = student_to_hostel_map.get(student_reg)
                    
                    if actual_location and actual_location['hostel_id'] != current_hostel_id:
                        # Student is in a different hostel than their allocation shows
                        allocations_to_fix.append({
                            'doc_id': alloc_id,
                            'student_reg': student_reg,
                            'old_hostel_id': current_hostel_id,
                            'new_hostel_id': actual_location['hostel_id'],
                            'room_id': actual_location['room_id'],
                            'room_number': actual_location['room_number'],
                            'hostel_name': actual_location['hostel_name']
                        })
                        validation_results['invalid_allocations'] += 1
                        
                        status = "🔄 Needs Fix"
                        print(f"│ {student_reg[:15]:15} │ {current_hostel_id[:15]:15} │ {actual_location['hostel_id'][:15]:15} │ {status:16} │")
                    else:
                        validation_results['valid_allocations'] += 1
                    continue
                
                # Current hostel ID is invalid, try to find the correct one
                actual_location = student_to_hostel_map.get(student_reg)
                
                if actual_location:
                    # Found the student in a room, update their allocation
                    allocations_to_fix.append({
                        'doc_id': alloc_id,
                        'student_reg': student_reg,
                        'old_hostel_id': current_hostel_id,
                        'new_hostel_id': actual_location['hostel_id'],
                        'room_id': actual_location['room_id'],
                        'room_number': actual_location['room_number'],
                        'hostel_name': actual_location['hostel_name']
                    })
                    validation_results['invalid_allocations'] += 1
                    
                    status = "🔄 Found Match"
                    print(f"│ {student_reg[:15]:15} │ {current_hostel_id[:15]:15} │ {actual_location['hostel_id'][:15]:15} │ {status:16} │")
                    validation_results['issues'].append(
                        f"Found correct hostel for {student_reg}: {actual_location['hostel_name']} Room {actual_location['room_number']}"
                    )
                else:
                    # Student not found in any room - don't delete, just mark as issue
                    validation_results['orphaned_allocations'] += 1
                    
                    status = "❌ No Match"
                    print(f"│ {student_reg[:15]:15} │ {current_hostel_id[:15]:15} │ {'Not Found':15} │ {status:16} │")
                    validation_results['issues'].append(
                        f"Student {student_reg} has allocation but not found in any room occupants (allocation kept)"
                    )
                    
            except Exception as e:
                validation_results['errors'] += 1
                validation_results['issues'].append(f"Error processing allocation {alloc_doc.id}: {str(e)}")
                print(f"│ {'ERROR':15} │ {'N/A':15} │ {'N/A':15} │ {'❌ Error':16} │")
        
        print("└─────────────────┴─────────────────┴─────────────────┴──────────────────┘")
        
        # Print validation summary
        print(f"\n📊 Validation Summary:")
        print(f"   ✅ Valid allocations: {validation_results['valid_allocations']}")
        print(f"   🔄 Allocations needing fixes: {len(allocations_to_fix)}")
        print(f"   ❌ Unmatched allocations (kept): {validation_results['orphaned_allocations']}")
        print(f"   ⚠️ Errors encountered: {validation_results['errors']}")
        
        # Fix invalid allocations if any
        if allocations_to_fix:
            print(f"\n🔧 Fixing {len(allocations_to_fix)} allocation(s) with incorrect hostel IDs...")
            
            from firebase_admin import firestore as admin_firestore
            
            for fix_item in allocations_to_fix:
                try:
                    alloc_ref = db.collection("roomAllocations").document(fix_item['doc_id'])
                    alloc_ref.update({
                        'hostelId': fix_item['new_hostel_id'],
                        'roomId': fix_item['room_id'],  # Also update room ID
                    })
                    
                    validation_results['fixed_allocations'] += 1
                    validation_results['fixes'].append(
                        f"Updated allocation for {fix_item['student_reg']}: "
                        f"{fix_item['old_hostel_id'][:8]}... → {fix_item['new_hostel_id'][:8]}... "
                        f"({fix_item['hostel_name']} Room {fix_item['room_number']})"
                    )
                    print(f"   ✓ Fixed {fix_item['student_reg']}: {fix_item['hostel_name']} Room {fix_item['room_number']}")
                    
                except Exception as e:
                    validation_results['errors'] += 1
                    validation_results['issues'].append(
                        f"Failed to fix allocation {fix_item['doc_id']} for {fix_item['student_reg']}: {str(e)}"
                    )
                    print(f"   ❌ Failed to fix {fix_item['student_reg']}: {str(e)}")
        
        # Don't delete orphaned allocations - just report them
        if validation_results['orphaned_allocations'] > 0:
            print(f"\n⚠️ Found {validation_results['orphaned_allocations']} allocation(s) with no matching room occupants")
            print("   These allocations were kept for manual review.")
            print("   Students may need to be manually added to rooms or allocations may need verification.")
        
        # Final summary
        print(f"\n✅ Validation and fixes completed:")
        print(f"   📊 Total allocations checked: {validation_results['total_allocations']}")
        print(f"   ✅ Valid allocations: {validation_results['valid_allocations']}")
        print(f"   🔧 Fixed allocations: {validation_results['fixed_allocations']}")
        print(f"   ⚠️ Unmatched allocations (kept): {validation_results['orphaned_allocations']}")
        
        if validation_results['errors'] > 0:
            print(f"   ❌ Errors encountered: {validation_results['errors']}")
        
    except Exception as e:
        print(f"❌ Error during allocation validation: {str(e)}")
        validation_results['errors'] += 1
        validation_results['issues'].append(f"Validation process error: {str(e)}")
    
    return validation_results

def main():
    """Main function to execute the hostel merger."""
    try:
        # Initialize Firebase
        db = initialize_firebase()
        print("✅ Firebase connected successfully")
        
        print("\n🔄 Starting duplicate hostel merger process...")
        
        # Get all hostels
        hostels = get_all_hostels(db)
        
        if not hostels:
            print("❌ No hostels found. Exiting.")
            return
        
        # Identify duplicate hostels
        duplicate_groups = identify_duplicate_hostels(hostels)
        
        if not duplicate_groups:
            print("ℹ️ No duplicate hostels to merge. Exiting.")
            return
        
        # Ask for confirmation
        confirm = input("\n❓ Do you want to proceed with merging duplicate hostels? (y/n): ")
        if confirm.lower() != 'y':
            print("⏹️ Merge cancelled by user. Exiting.")
            return
        
        # Process each group of duplicates
        all_merge_results = {
            'successful_merges': 0,
            'conflicts': 0,
            'completely_merged': [],
            'partially_merged': [],
            'processed_groups': [],
            'allocation_updates': 0  # Add tracking for allocation updates
        }
        
        # Track hostel ID mappings for validation
        merge_mapping = {}  # old_hostel_id -> primary_hostel_id
        
        # Create a batch for all operations
        batch = db.batch()
        
        for group_name, hostel_ids in duplicate_groups.items():
            print(f"\n{'='*60}")
            print(f"🏠 PROCESSING DUPLICATE GROUP: '{group_name}'")
            print(f"{'='*60}")
            
            # Find the primary hostel in this group
            primary_id = find_primary_hostel_in_group(hostels, hostel_ids)
            
            # Track the mapping for all hostels in this group
            for hostel_id in hostel_ids:
                if hostel_id != primary_id:
                    merge_mapping[hostel_id] = primary_id
            
            # Merge this group
            merge_results = merge_hostel_group(primary_id, hostel_ids, hostels)
            
            # Display merge summary for this group
            display_group_merge_summary(merge_results, hostels, primary_id, group_name)
            
            # Update database batch with operations for this group
            operations, batch = update_hostels_for_group(db, hostels, merge_results, batch)
            
            print("\n📝 Updating student allocations...")
            # Update student allocations for merged hostels
            allocation_updates, batch = update_student_allocations(db, merge_results, primary_id, hostels, batch)

            # Track overall results
            all_merge_results['successful_merges'] += merge_results['successful_merges']
            all_merge_results['conflicts'] += merge_results['conflicts']
            all_merge_results['completely_merged'].extend(merge_results['completely_merged'])
            all_merge_results['partially_merged'].extend(merge_results['partially_merged'])
            all_merge_results['allocation_updates'] += allocation_updates
            all_merge_results['processed_groups'].append({
                'name': group_name,
                'primary_id': primary_id,
                'updated': len(operations['updated']),
                'deleted': len(operations['to_delete']),
                'allocations_updated': allocation_updates
            })
        
        # Display overall summary
        print("\n" + "="*60)
        print("📊 OVERALL MERGE SUMMARY")
        print("="*60)
        
        print(f"\n✅ Successfully merged {all_merge_results['successful_merges']} students")
        print(f"❌ Encountered {all_merge_results['conflicts']} room conflicts")
        print(f"🏠 Processed {len(all_merge_results['processed_groups'])} groups of duplicate hostels")
        print(f"🗑️ Will delete {len(all_merge_results['completely_merged'])} completely merged hostels")
        print(f"🔄 Updated {all_merge_results['allocation_updates']} student hostel allocations")
        
        # Ask for confirmation before updating database
        confirm = input("\n❓ Do you want to save these changes to the database? (y/n): ")
        if confirm.lower() != 'y':
            print("⏹️ Changes not saved. Exiting.")
            return
        
        # Commit all changes
        print("\n🔄 Updating database...")
        batch.commit()
        
        # Show final results
        print("\n✅ Database update complete!")
        print(f"🗑️ Deleted {len(all_merge_results['completely_merged'])} completely merged hostels")
        print(f"✅ Updated {all_merge_results['allocation_updates']} hostel allocation records")
        
        # After merging, validate and fix any remaining allocation issues
        if merge_mapping:
            print("\n" + "="*60)
            print("🔍 POST-MERGE VALIDATION")
            print("="*60)
            
            # Refresh hostels data after merge
            updated_hostels = get_all_hostels(db)
            
            # Run validation and fix any issues
            validation_results = validate_and_fix_allocation_hostel_ids(db, updated_hostels, merge_mapping)
            
            # Display validation summary
            print(f"\n📋 Final Validation Report:")
            print(f"   📊 Total allocations validated: {validation_results['total_allocations']}")
            print(f"   ✅ Valid allocations: {validation_results['valid_allocations']}")
            print(f"   🔧 Fixed allocations: {validation_results['fixed_allocations']}")
            print(f"   🗑️ Orphaned allocations: {validation_results['orphaned_allocations']}")
            
            if validation_results['errors'] > 0:
                print(f"   ⚠️ Errors during validation: {validation_results['errors']}")
                print("   📝 Issues encountered:")
                for issue in validation_results['issues']:
                    print(f"      - {issue}")
            
            if validation_results['fixes']:
                print("   ✅ Fixes applied:")
                for fix in validation_results['fixes']:
                    print(f"      - {fix}")
        
        print("\n🎉 Duplicate hostel merger and validation complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()