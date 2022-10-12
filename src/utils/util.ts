import jwt_decode from "jwt-decode";

export const verifyJwt = (token: string) => {
    if (token) {
        var decoded = jwt_decode(token) as any;
        const time = new Date().getTime();
        if (time < decoded.exp * 1000) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

export const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

export const formatPhoneNumber = (phoneNumber?: string) => {
    if (phoneNumber) {
        const input = phoneNumber.replace(/\D/g, "").substring(0, 11); // First ten digits of input only
        const areaCode = input.substring(0, 2);
        const middle = input.substring(2, 6);
        const last = input.substring(6, 11);
    
        if (input.length > 6) {
          return (phoneNumber = `${areaCode}-${middle}-${last}`);
        } else if (input.length > 3) {
          return (phoneNumber = `${areaCode}-${middle}`);
        } else if (input.length > 0) {
          return (phoneNumber = `(${areaCode}`);
        }
    }
}


