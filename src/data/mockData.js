// export const mockUnits = [
//   // Units for Project 1: Marina Heights Tower
//   {
//     unit_id: 101,
//     project_id: 1,
//     unit_number: "S101",
//     price: 850000,
//     bedrooms: 0,
//     property_type: "studio",
//     area_sqft: 450,
//     floor_level: 10,
//     status: "available",
//     demand_status: 'normal',
//     has_balcony: false,
//     has_parking: true,
//     phase: "A",
//     // highlight-start
//     imageUrl: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600",
//     // highlight-end
//   },
//   {
//     unit_id: 102,
//     project_id: 1,
//     unit_number: "A102",
//     price: 1200000,
//     bedrooms: 1,
//     property_type: "apartment",
//     area_sqft: 750,
//     floor_level: 12,
//     status: "available",
//     demand_status: 'normal',
//     has_balcony: true,
//     has_parking: true,
//     phase: "B",
//     // highlight-start
//     imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
//     // highlight-end
//   },
//   {
//     unit_id: 103,
//     project_id: 1,
//     unit_number: "B201",
//     price: 1800000,
//     bedrooms: 2,
//     property_type: "apartment",
//     area_sqft: 1100,
//     floor_level: 20,
//     demand_status: 'normal',
//     status: "sold",
//     has_balcony: true,
//     has_parking: true,
//     phase: "A",
   
//     imageUrl: "https://images.pexels.com/photos/6585626/pexels-photo-6585626.jpeg?auto=compress&cs=tinysrgb&w=600",
    
//   },
//   {
//     unit_id: 201,
//     project_id: 2,
//     unit_number: "D301",
//     price: 1350000,
//     bedrooms: 1,
//     property_type: "apartment",
//     area_sqft: 820,
//     demand_status: 'normal',
//     floor_level: 5,
//     status: "available",
//     has_balcony: true,
//     has_parking: true,
//     phase: "Luxury Wing",
//     // highlight-start
//     imageUrl: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600",
//     // highlight-end
//   },
// ];

export const mockAreas = [
  { area_id: 1, area_name_en: "Dubai Marina", area_name_ar: "مرسى دبي" },
  { area_id: 2, area_name_en: "Downtown Dubai", area_name_ar: "وسط مدينة دبي" },
  { area_id: 3, area_name_en: "Palm Jumeirah" },
  { area_id: 4, area_name_en: "Business Bay" },
  { area_id: 5, area_name_en: "JBR" },
];

export const mockZones = [
  { zone_id: 1, area_id: 1, zone_name_en: "Marina Walk" },
  { zone_id: 2, area_id: 1, zone_name_en: "Marina Promenade" },
  { zone_id: 3, area_id: 2, zone_name_en: "DIFC" },
  { zone_id: 4, area_id: 2, zone_name_en: "Opera District" },
  { zone_id: 5, area_id: 3, zone_name_en: "Palm West Beach" },
  { zone_id: 6, area_id: 4, zone_name_en: "Business Bay Central" },
  { zone_id: 7, area_id: 5, zone_name_en: "JBR The Walk" },
];

export const mockProjects = [
  {
    project_id: 1,
    project_name: "Marina Heights Tower",
    // highlight-start
    imageUrl:
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    // highlight-end
    area_id: 1,
    zone_id: 1,
    completion_status: "under_construction",
    min_price: 800000,
    max_price: 2500000,
    total_units: 200,
            commonAreaRatio: 1.2,

    available_units: 35, // This is < 20% of 200    completion_date: "2025-12-31",
    developer: "Emaar Properties",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Concierge"],
  },
  {
    project_id: 2,
    project_name: "Downtown Luxury Residences",
    // highlight-start
    imageUrl:
      "https://images.pexels.com/photos/3935320/pexels-photo-3935320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    // highlight-end
    area_id: 2,
    zone_id: 3,
    completion_status: "off_plan",
    min_price: 1200000,
    max_price: 4000000,
    total_units: 150,
    available_units: 25, // Reduced to show the "low availability" state
    completion_date: "2026-06-30",
    developer: "DAMAC Properties",
    amenities: [
      "Rooftop Pool",
      "Spa",
      "Valet Parking",
      "Business Center",
      "Kids Play Area",
    ],
  },
   {
    project_id: 3,
    project_name: "Creekfront Residences",
    imageUrl: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    area_id: 4, // Business Bay
    zone_id: 6,
    completion_status: "ready",
    min_price: 950000,
    max_price: 3200000,
    total_units: 250,
    available_units: 210,
    completion_date: "2024-01-15",
    developer: "Sobha Realty",
    amenities: ["Swimming Pool", "Gym", "Security", "Kids Play Area", "Retail Outlets"],
  },
];

const generateUnits = (projectId, count) => {
    let units = [];
    for(let i=1; i<=count; i++) {
        const bedrooms = Math.floor(Math.random() * 4); // 0-3 BR
        const type = bedrooms === 0 ? 'studio' : 'apartment';
        const area = 400 + bedrooms * 300 + Math.floor(Math.random() * 100);
        const price = 800000 + area * 500 + bedrooms * 150000;

        units.push({
            unit_id: projectId * 1000 + i,
            project_id: projectId,
            unit_number: `${String.fromCharCode(65 + (i % 26))}${projectId}0${i}`,
            price: Math.round(price/1000) * 1000,
            bedrooms: bedrooms,
            property_type: type,
            area_sqft: area,
            floor_level: 1 + Math.floor(Math.random() * 40),
            status: Math.random() < 0.85 ? 'available' : 'sold',
            demand_status: 'normal',
            has_balcony: Math.random() > 0.4,
            has_parking: Math.random() > 0.2,
            phase: i % 3 === 0 ? 'B' : 'A',
        });
    }
    return units;
};
export const mockUnits = [
    ...generateUnits(1, 150),
    ...generateUnits(2, 80),
    ...generateUnits(3, 250)
];