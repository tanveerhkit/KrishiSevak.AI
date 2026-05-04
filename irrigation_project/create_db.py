from app import db, Crop, GrowthStage

# Create the tables in the SQLite database
db.create_all()

# Sample crop data
wheat = Crop(name="Wheat")
rice = Crop(name="Rice")

# Add crops to the session
db.session.add(wheat)
db.session.add(rice)

# Commit the crops to the database
db.session.commit()

# Sample growth stages for Wheat
seedling = GrowthStage(name="Seedling", water_requirement=1.2, crop_id=wheat.id)
vegetative = GrowthStage(name="Vegetative", water_requirement=1.5, crop_id=wheat.id)
mature = GrowthStage(name="Mature", water_requirement=1.8, crop_id=wheat.id)

# Sample growth stages for Rice
rice_seedling = GrowthStage(name="Seedling", water_requirement=1.3, crop_id=rice.id)
rice_vegetative = GrowthStage(name="Vegetative", water_requirement=1.7, crop_id=rice.id)
rice_mature = GrowthStage(name="Mature", water_requirement=2.0, crop_id=rice.id)

# Add growth stages to the session
db.session.add(seedling)
db.session.add(vegetative)
db.session.add(mature)
db.session.add(rice_seedling)
db.session.add(rice_vegetative)
db.session.add(rice_mature)

# Commit the growth stages to the database
db.session.commit()

print("Sample data added successfully!")
