type QRCode = {
    id: string;
    name: string;
    bgColor: string;
    fgColor: string;
    eyeColor: string;
    eyeRadius: number;
    image: string;
    link: string;
    size: number;
    type: string;
}

type User = {
    id: string;
    name: string;
    email: string;
    photoURL: string;
}

export type { QRCode, User };