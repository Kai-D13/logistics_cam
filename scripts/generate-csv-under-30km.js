/**
 * Generate CSV file with hub destinations where distance < 30km
 * Includes: hub_id, hub_name, destination_name, ward, district, province, carrier_type, distance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Read data files
const hubsPath = path.join(__dirname, '..', 'frontend', 'public', 'hubs.json');
const destinationsPath = path.join(__dirname, '..', 'frontend', 'public', 'destinations.json');

console.log('📊 Generating CSV file: Hub Destinations with Distance < 30km\n');

try {
  const hubs = JSON.parse(fs.readFileSync(hubsPath, 'utf8'));
  const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf8'));
  
  console.log(`✅ Loaded ${hubs.length} hubs`);
  console.log(`✅ Loaded ${destinations.length} destinations\n`);
  
  // CSV header
  const csvHeader = 'Hub ID,Hub Name,Hub Province,Destination ID,Destination Name,Ward,District,Province,Carrier Type,Orders/Month,Distance (km),Lat,Long\n';
  
  let csvContent = csvHeader;
  let rowCount = 0;
  let totalDestinations = 0;
  
  // Process each hub
  hubs.forEach(hub => {
    const hubDestinations = destinations.filter(d => d.hub_id === hub.id);
    totalDestinations += hubDestinations.length;
    
    let hubCount = 0;
    
    hubDestinations.forEach(dest => {
      // Calculate distance
      const distance = calculateDistance(
        hub.lat, hub.long,
        dest.lat, dest.long
      );
      
      // Only include if distance < 30km
      if (distance < 30) {
        const row = [
          hub.id,
          hub.name,
          hub.province_name,
          dest.id,
          dest.name,
          dest.ward_name || 'N/A',
          dest.district_name || 'N/A',
          dest.province_name || 'N/A',
          dest.carrier_type || 'N/A',
          dest.oders_per_month || 0,
          distance.toFixed(2),
          dest.lat,
          dest.long
        ].map(field => {
          // Escape commas and quotes in CSV
          const str = String(field);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',');
        
        csvContent += row + '\n';
        rowCount++;
        hubCount++;
      }
    });
    
    console.log(`📍 ${hub.name}: ${hubCount}/${hubDestinations.length} destinations within 30km`);
  });
  
  // Write CSV file
  const outputPath = path.join(__dirname, 'hub_destinations_under_30km.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total hubs: ${hubs.length}`);
  console.log(`Total destinations: ${totalDestinations}`);
  console.log(`Destinations within 30km: ${rowCount} (${(rowCount/totalDestinations*100).toFixed(1)}%)`);
  console.log(`Destinations beyond 30km: ${totalDestinations - rowCount} (${((totalDestinations-rowCount)/totalDestinations*100).toFixed(1)}%)`);
  console.log('\n✅ CSV file created successfully!');
  console.log(`📁 Location: ${outputPath}`);
  console.log(`📊 Rows: ${rowCount} (excluding header)`);
  console.log(`💾 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
