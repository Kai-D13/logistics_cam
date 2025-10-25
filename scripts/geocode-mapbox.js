/**
 * Geocode destinations using Mapbox Geocoding API
 * 
 * Usage:
 *   node scripts/geocode-mapbox.js
 * 
 * Requirements:
 *   - Mapbox access token (set in MAPBOX_TOKEN below)
 *   - destinations.json in root directory
 * 
 * Output:
 *   - destinations_geocoded.json (with lat/long filled)
 */

import fs from 'fs';

// ⚠️ REPLACE WITH YOUR MAPBOX TOKEN
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw';

// Rate limiting
const DELAY_MS = 100; // 100ms = 600 requests/minute (Mapbox limit: 600/min)

/**
 * Geocode a single address using Mapbox API
 */
async function geocodeAddress(address) {
  const encodedAddress = encodeURIComponent(address + ', Cambodia');
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?country=KH&limit=1&access_token=${MAPBOX_TOKEN}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Mapbox token. Please check MAPBOX_TOKEN.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait and try again.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      const placeName = data.features[0].place_name;
      return { lat, lng, placeName };
    }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
  
  return null;
}

/**
 * Try multiple address formats for better geocoding success
 */
async function geocodeWithFallback(dest) {
  // Try full address first
  let coords = await geocodeAddress(dest.address);
  if (coords) return coords;
  
  // Try without ward
  coords = await geocodeAddress(`${dest.district_name}, ${dest.province_name}`);
  if (coords) return coords;
  
  // Try province only
  coords = await geocodeAddress(dest.province_name);
  if (coords) return coords;
  
  return null;
}

/**
 * Validate coordinates are within Cambodia bounds
 */
function isValidCambodiaCoordinate(lat, lng) {
  // Cambodia approximate bounds: 10-15°N, 102-108°E
  return lat >= 10 && lat <= 15 && lng >= 102 && lng <= 108;
}

/**
 * Main geocoding function
 */
async function geocodeAllDestinations() {
  console.log('🗺️  Mapbox Geocoding Script');
  console.log('=' .repeat(50));
  console.log('');
  
  // Read destinations
  let destinations;
  try {
    const data = fs.readFileSync('../destinations.json', 'utf8');
    destinations = JSON.parse(data);
    console.log(`✅ Loaded ${destinations.length} destinations`);
  } catch (error) {
    console.error('❌ Error reading destinations.json:', error.message);
    console.error('   Make sure destinations.json exists in the root directory.');
    process.exit(1);
  }
  
  // Check how many already have coordinates
  const alreadyGeocoded = destinations.filter(d => 
    d.lat && d.long && d.lat !== '' && d.long !== ''
  ).length;
  
  console.log(`📊 Already geocoded: ${alreadyGeocoded}/${destinations.length}`);
  console.log(`🔄 Need to geocode: ${destinations.length - alreadyGeocoded}`);
  console.log('');
  
  if (alreadyGeocoded === destinations.length) {
    console.log('✅ All destinations already have coordinates!');
    console.log('   Nothing to do.');
    return;
  }
  
  // Confirm before starting
  console.log('⚠️  This will make API requests to Mapbox.');
  console.log(`   Estimated time: ~${Math.ceil((destinations.length - alreadyGeocoded) * DELAY_MS / 1000)} seconds`);
  console.log('');
  console.log('Starting in 3 seconds... (Ctrl+C to cancel)');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('');
  
  // Geocode each destination
  const updated = [];
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const progress = `[${i + 1}/${destinations.length}]`;
    
    console.log(`${progress} ${dest.name} (${dest.province_name})`);
    
    // Skip if already has coordinates
    if (dest.lat && dest.long && dest.lat !== '' && dest.long !== '') {
      console.log(`  ⏭️  Already has coordinates: ${dest.lat}, ${dest.long}`);
      updated.push(dest);
      skippedCount++;
      continue;
    }
    
    // Geocode
    const coords = await geocodeWithFallback(dest);
    
    if (coords) {
      // Validate coordinates
      if (!isValidCambodiaCoordinate(coords.lat, coords.lng)) {
        console.log(`  ⚠️  Coordinates outside Cambodia: ${coords.lat}, ${coords.lng}`);
        console.log(`     Place: ${coords.placeName}`);
        console.log(`     Using anyway (might be border area)`);
      }
      
      dest.lat = coords.lat;
      dest.long = coords.lng;
      console.log(`  ✅ Found: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      console.log(`     ${coords.placeName}`);
      successCount++;
    } else {
      console.log(`  ❌ Not found`);
      failCount++;
    }
    
    updated.push(dest);
    
    // Rate limiting
    if (i < destinations.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
  
  // Save results
  console.log('');
  console.log('💾 Saving results...');
  
  try {
    fs.writeFileSync(
      'destinations_geocoded.json', 
      JSON.stringify(updated, null, 2),
      'utf8'
    );
    console.log('✅ Saved to destinations_geocoded.json');
  } catch (error) {
    console.error('❌ Error saving file:', error.message);
    process.exit(1);
  }
  
  // Summary
  console.log('');
  console.log('=' .repeat(50));
  console.log('📊 SUMMARY');
  console.log('=' .repeat(50));
  console.log(`Total destinations:     ${destinations.length}`);
  console.log(`Already had coordinates: ${skippedCount}`);
  console.log(`Successfully geocoded:  ${successCount}`);
  console.log(`Failed to geocode:      ${failCount}`);
  console.log('');
  
  const totalWithCoords = updated.filter(d => 
    d.lat && d.long && d.lat !== '' && d.long !== ''
  ).length;
  
  const successRate = ((totalWithCoords / destinations.length) * 100).toFixed(1);
  
  console.log(`✅ Final: ${totalWithCoords}/${destinations.length} destinations have coordinates (${successRate}%)`);
  console.log('');
  
  if (failCount > 0) {
    console.log('⚠️  Failed destinations:');
    updated
      .filter(d => !d.lat || !d.long || d.lat === '' || d.long === '')
      .forEach(d => {
        console.log(`   - ${d.name} (${d.address})`);
      });
    console.log('');
    console.log('💡 Tip: You can manually add coordinates for these using Google Maps.');
  }
  
  // Next steps
  console.log('🚀 NEXT STEPS:');
  console.log('');
  console.log('1. Verify results:');
  console.log('   cat destinations_geocoded.json | jq ".[0:3]"');
  console.log('');
  console.log('2. If good, replace original:');
  console.log('   cp destinations_geocoded.json destinations.json');
  console.log('');
  console.log('3. Copy to frontend:');
  console.log('   cp destinations.json frontend/public/destinations.json');
  console.log('');
  console.log('4. Refresh browser and test!');
  console.log('');
}

// Run
geocodeAllDestinations().catch(error => {
  console.error('');
  console.error('💥 Fatal error:', error.message);
  console.error('');
  process.exit(1);
});

