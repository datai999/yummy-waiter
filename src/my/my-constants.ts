import { Pho } from 'myTypes';

export enum Categories {
    BEEF = "BEEF",
    CHICKEN = "CHICKEN",
    SIDE_ORDERS = "SIDE ORDERS",
    DRINKS = "DRINKS",
    DESSERT = "DESSERT",
}

export enum BeefMeats {
    SPECIAL = "DB",
    RARE = "Tái",
    LEAN = "Chín",
    FATTY = "Gầu",
    TENDON = "Gân",
    TRIPE = "Sách",
    BEEF_BALL = "Bò viên",
    RIBS = "Xi",
    BEEF_STEW = "Hủ tiếu BK",
    BEEF_STEW_BREAD = "B.mì BK",
}

export enum BeefMeatCodes {
    SPECIAL = "DB",
    RARE = "T",
    LEAN = "C",
    FATTY = "G`",
    TENDON = "g",
    TRIPE = "S",
    BEEF_BALL = "BV",
    RIBS = "Xi",
    BEEF_STEW = "Pho BK",
    BEEF_STEW_BREAD = "B.mì BK",
    BPN = "BPN",
}

export enum ChickenMeats {
    WHITE = "Ức",
    WING = "Cánh",
    DARK = "Đùi"
}

export enum Noodles {
    REGULAR = "BC",
    FRESH = "BT",
    REGULAR_UNCOOKED = "BS",
    FRESH_UNCOOKED = "BTS",
    VERMICELL = "Bún",
    GLASS = "Miến"
}

export enum BeefPreferences {
    TOGO = "TOGO",
    NO_ONION = "Không hành",
    NO_FAT = "Không béo",
    LESS_NOODLE = "Ít bánh",
    RARE_OUTSIDE = "Tái Riêng",
    VINEGAR_ONION = "HD",
    ROOT_ONION = "HT",
    FAT = "Béo"
}

export enum BeefPreferenceCodes {
    TOGO = "TOGO",
    NO_ONION = "No H",
    NO_FAT = "No Béo",
    LESS_NOODLE = "-b",
    RARE_OUTSIDE = "R",
    VINEGAR_ONION = "HD",
    ROOT_ONION = "HT",
    FAT = "Béo"
}

export enum ChikenPreferences {
    TOGO = "TOGO",
    NO_ONION = "Không hành",
    NO_SKIN = "No skin",
    BAMBOO_SHOOTS = "Măng",
    DRY = "Khô",
}

export const DefaultPho: Pho = {
    id: '',
    meats: [],
    noodle: "REGULAR",
    preferences: [],
    note: ''
}