export class Base {
    // public static API_URI = 'http://ex.saiimog.com/tigerwealth/API';
    // public static img_path = 'http://ex.saiimog.com/tigerwealth/API/public/images/';
    public static API_URI       = 'http://localhost:8000';
    public static img_path     = 'http://localhost:8000/images/';

    api_url(){
        return 'http://localhost:8000';
    }
    img_url(){
        return 'http://localhost:8000/images/';
    }
}
