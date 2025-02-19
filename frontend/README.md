# Water me now

## Plan

Frontend

- GET all plants and display them
- ADD a new plant
- EDIT a plant
- Send mail notifications
- Dashboard : list the next tasks / events
- Image Upload function
- Admin area with login for adding and editing plants
- GET all pests
- GET all seasonal events
- display everything with cute symbols

Backend

- Plant Class:
- id,
- name,
- origin
- image file name,
- hardiness,
- hardiness info eg. "Has to be protected during winter" (text),
- ideal_location, eg. "in full sun" (enum),
- watering eg "once a week",
- soil_type eg. "loam spoil" (enum),
- perennial (true/false)
- feature enum LIST
- ideal_placement
- seasonal_event list with ids
- propagation (text)
- fertilization_schedule, eg. "Once a month" (enum)
- common_pests list with ids
- companion_plants (list with ids)
- uses (list of Strings)
-
- hardiness Enum: FULLY_HARDY, PARTIALLY_HARDY, NOT_HARDY
- ideal_location Enum: FULL_SUN, INDIRECT_SUN, SHADOW,
- ideal_placement Enum: INDOORS, OUTDOORS, BOTH
- feature Enum: CLIMBING_HABIT, FRAGRANT, LOW_MAINTENANCE, DROUGHT_TOLERANT, FAST_GROWER
- seasonal_event Class:
- id
- name, eg. "make winterproof", "put outside", "fertilize", "prune", "plant new vegetables"
- plants list + what there is to do: {plant_id: 5, to_do: "cover with leaves"}
- date
- picture for reference
-
- fertilization_schedule Enum: ONCE_A_MONTH, ONCE_A_WEEK
- common_pests Class:
- id
- name
- plants list
- to_do
- picture for reference
- soil_type enum: CULTIVATION_SOIL, PALM_SOIL, POTTING_SOIL, CACTUS_SOIL
