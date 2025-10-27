/**
 * Update Phnom Penh destinations with correct coordinates
 * 
 * This script:
 * 1. Reads the new Phnom Penh data with correct coordinates
 * 2. Updates the main destinations.json file
 * 3. Creates a backup before updating
 * 
 * Usage:
 *   node scripts/update-phnom-penh-coordinates.js
 */

import fs from 'fs';
import path from 'path';

// File paths
const NEW_DATA_PATH = '../phnom_penh_destinations.json';
const DESTINATIONS_PATH = '../frontend/public/destinations.json';
const BACKUP_PATH = '../frontend/public/destinations.backup.json';

console.log('🔄 Phnom Penh Coordinates Update Script');
console.log('=' .repeat(60));
console.log('');

// Step 1: Read new Phnom Penh data
console.log('📖 Step 1: Reading new Phnom Penh data...');
let newPhnomPenhData;
try {
  const data = fs.readFileSync(NEW_DATA_PATH, 'utf8');
  newPhnomPenhData = JSON.parse(data);
  console.log(`✅ Loaded ${newPhnomPenhData.length} Phnom Penh destinations`);
} catch (error) {
  console.error('❌ Error reading phnom_penh_destinations.json:', error.message);
  process.exit(1);
}

// Step 2: Read current destinations
console.log('');
console.log('📖 Step 2: Reading current destinations.json...');
let currentDestinations;
try {
  const data = fs.readFileSync(DESTINATIONS_PATH, 'utf8');
  currentDestinations = JSON.parse(data);
  console.log(`✅ Loaded ${currentDestinations.length} total destinations`);
} catch (error) {
  console.error('❌ Error reading destinations.json:', error.message);
  process.exit(1);
}

// Step 3: Create backup
console.log('');
console.log('💾 Step 3: Creating backup...');
try {
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(currentDestinations, null, 2), 'utf8');
  console.log(`✅ Backup created: ${BACKUP_PATH}`);
} catch (error) {
  console.error('❌ Error creating backup:', error.message);
  process.exit(1);
}

// Step 4: Create mapping from new data
console.log('');
console.log('🗺️  Step 4: Creating coordinate mapping...');
const coordinateMap = new Map();
newPhnomPenhData.forEach(item => {
  const destId = item['Destination ID'];
  coordinateMap.set(destId, {
    lat: item.Lat,
    long: item.Long,
    orders: item['Orders/Month'],
    ward: item.Ward,
    district: item.District,
    province: item.Province
  });
});
console.log(`✅ Created mapping for ${coordinateMap.size} destinations`);

// Step 5: Update destinations
console.log('');
console.log('🔧 Step 5: Updating coordinates...');
let updateCount = 0;
let notFoundCount = 0;
const notFoundIds = [];

currentDestinations.forEach(dest => {
  if (coordinateMap.has(dest.id)) {
    const newData = coordinateMap.get(dest.id);
    
    // Store old values for logging
    const oldLat = dest.lat;
    const oldLong = dest.long;
    const oldOrders = dest.oders_per_month;
    
    // Update coordinates and orders
    dest.lat = newData.lat;
    dest.long = newData.long;
    dest.oders_per_month = newData.orders;
    
    // Also update ward/district/province if different
    if (dest.ward_name !== newData.ward) {
      console.log(`  ⚠️  ${dest.id}: Ward changed from "${dest.ward_name}" to "${newData.ward}"`);
      dest.ward_name = newData.ward;
    }
    if (dest.district_name !== newData.district) {
      console.log(`  ⚠️  ${dest.id}: District changed from "${dest.district_name}" to "${newData.district}"`);
      dest.district_name = newData.district;
    }
    
    // Log if coordinates changed significantly
    const latDiff = Math.abs(oldLat - newData.lat);
    const longDiff = Math.abs(oldLong - newData.long);
    if (latDiff > 0.001 || longDiff > 0.001) {
      console.log(`  ✏️  ${dest.id} (${dest.name}):`);
      console.log(`      Old: ${oldLat.toFixed(6)}, ${oldLong.toFixed(6)}`);
      console.log(`      New: ${newData.lat.toFixed(6)}, ${newData.long.toFixed(6)}`);
      console.log(`      Δ: ${latDiff.toFixed(6)}, ${longDiff.toFixed(6)}`);
    }
    
    updateCount++;
  } else if (dest.province_name === 'Phnom Penh') {
    // This is a Phnom Penh destination but not in new data
    notFoundCount++;
    notFoundIds.push(dest.id);
  }
});

console.log('');
console.log(`✅ Updated ${updateCount} destinations`);
if (notFoundCount > 0) {
  console.log(`⚠️  ${notFoundCount} Phnom Penh destinations not found in new data:`);
  notFoundIds.forEach(id => console.log(`   - ${id}`));
}

// Step 6: Validate updated data
console.log('');
console.log('✔️  Step 6: Validating updated data...');
let validationErrors = 0;

currentDestinations.forEach(dest => {
  // Check for missing coordinates
  if (!dest.lat || !dest.long) {
    console.log(`  ❌ ${dest.id}: Missing coordinates`);
    validationErrors++;
  }
  
  // Check for invalid coordinates (Cambodia bounds: 10-15°N, 102-108°E)
  if (dest.lat < 10 || dest.lat > 15 || dest.long < 102 || dest.long > 108) {
    console.log(`  ⚠️  ${dest.id}: Coordinates outside Cambodia: ${dest.lat}, ${dest.long}`);
  }
});

if (validationErrors > 0) {
  console.log(`❌ Found ${validationErrors} validation errors`);
  console.log('⚠️  Please fix errors before proceeding');
  process.exit(1);
}
console.log('✅ All validations passed');

// Step 7: Check for duplicate coordinates
console.log('');
console.log('🔍 Step 7: Checking for duplicate coordinates...');
const coordMap = new Map();
let duplicateCount = 0;

currentDestinations.forEach(dest => {
  if (dest.province_name === 'Phnom Penh') {
    const coordKey = `${dest.lat.toFixed(6)},${dest.long.toFixed(6)}`;
    if (coordMap.has(coordKey)) {
      coordMap.get(coordKey).push(dest.id);
    } else {
      coordMap.set(coordKey, [dest.id]);
    }
  }
});

coordMap.forEach((ids, coord) => {
  if (ids.length > 1) {
    console.log(`  ⚠️  Duplicate at ${coord}: ${ids.join(', ')}`);
    duplicateCount++;
  }
});

if (duplicateCount === 0) {
  console.log('✅ No duplicate coordinates found in Phnom Penh destinations');
} else {
  console.log(`⚠️  Found ${duplicateCount} sets of duplicate coordinates`);
}

// Step 8: Save updated data
console.log('');
console.log('💾 Step 8: Saving updated destinations.json...');
try {
  fs.writeFileSync(
    DESTINATIONS_PATH,
    JSON.stringify(currentDestinations, null, 2),
    'utf8'
  );
  console.log('✅ Successfully saved updated destinations.json');
} catch (error) {
  console.error('❌ Error saving file:', error.message);
  console.log('');
  console.log('🔄 Restoring from backup...');
  try {
    const backup = fs.readFileSync(BACKUP_PATH, 'utf8');
    fs.writeFileSync(DESTINATIONS_PATH, backup, 'utf8');
    console.log('✅ Restored from backup');
  } catch (restoreError) {
    console.error('❌ Error restoring backup:', restoreError.message);
  }
  process.exit(1);
}

// Summary
console.log('');
console.log('=' .repeat(60));
console.log('📊 SUMMARY');
console.log('=' .repeat(60));
console.log(`Total destinations:           ${currentDestinations.length}`);
console.log(`Phnom Penh destinations:      ${currentDestinations.filter(d => d.province_name === 'Phnom Penh').length}`);
console.log(`Updated:                      ${updateCount}`);
console.log(`Not found in new data:        ${notFoundCount}`);
console.log(`Duplicate coordinates:        ${duplicateCount}`);
console.log('');
console.log('✅ Update completed successfully!');
console.log('');
console.log('🚀 NEXT STEPS:');
console.log('');
console.log('1. Test on localhost:');
console.log('   cd frontend');
console.log('   npm run dev');
console.log('');
console.log('2. Check the map for Phnom Penh destinations');
console.log('   - Select "Hub Phnom Penh"');
console.log('   - Verify markers are not overlapping');
console.log('   - Check coordinates in popups');
console.log('');
console.log('3. If everything looks good:');
console.log('   - You can commit the changes');
console.log('   - Delete the backup file if not needed');
console.log('');
console.log('4. If there are issues:');
console.log('   - Restore from backup:');
console.log('     cp frontend/public/destinations.backup.json frontend/public/destinations.json');
console.log('');

