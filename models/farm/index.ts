export interface TFarm {
    id : string,
    name : string,
    location : {
        type : string,
        coordinates : number[]
    },
    crop_type : string,
    crop_status : string,
    planting_date : string,
    expected_harvest_date : string,
    created_at : string,
    updated_at : string,
}

    
