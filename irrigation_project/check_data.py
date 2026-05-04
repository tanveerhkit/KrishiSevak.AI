from app import db, Crop, GrowthStage

# Query all crops and their associated growth stages
crops = Crop.query.all()
for crop in crops:
    print(f"Crop Name: {crop.name}")
    for stage in crop.stages:
        print(f"  Stage: {stage.name} | Water Requirement: {stage.water_requirement} mm/day")
