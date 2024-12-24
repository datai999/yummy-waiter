import { Pho, SelectedItem } from 'myTypes';

export enum Categories {
    BEEF = "BEEF",
    CHICKEN = "CHICKEN",
    SIDE_ORDERS = "SIDE_ORDERS",
    DRINKS = "DRINKS"
}

export enum BeefSideOrder {
    VINEGAR_ONION = "Hành dấm",
    ROOT_ONION = "Hành trần",
    FAT = "Chén béo",
    XiQ = "Xí Quách",
    EXTRA_NOODLE = "Chén bánh",
    EXTRA_FRESH_NOODLE = "Chén BT",
    EGG_YOLK = "Chén trứng",
    BREAD = "Bánh mì"
}

export enum BeefSideOrderCodes {
    VINEGAR_ONION = "HD",
    ROOT_ONION = "HT",
    FAT = "Béo",
    XiQ = "XiQ",
    EXTRA_NOODLE = "Ch.Bánh",
    EXTRA_FRESH_NOODLE = "Ch.BT",
    EGG_YOLK = "Ch.Egg",
    BREAD = "B.Mì"
}

export enum BeefMeatSideOrder {
    RARE = "Dĩa Tái",
    RARE_SOUP = "Chén Tái",
    LEAN = "Chén Chín",
    FATTY = "Chén Gầu",
    TENDON = "Chén Gân",
    TRIPE = "Chén Sách",
    BEEF_BALL = "Chén Bò viên",
}

export enum BeefMeatSideOrderCodes {
    RARE = "Dĩa T",
    RARE_SOUP = "Ch.T",
    LEAN = "Ch.C",
    FATTY = "Ch.G`",
    TENDON = "Ch.g",
    TRIPE = "Ch.S",
    BEEF_BALL = "Ch.BV",
}

export enum ChickenSideOrder {
    BAMBO_SHOOTS = "Măng",
    WHOLE_CHICKEN = "Con gà",
    HALF_CHICKEN = "Nửa con gà",
    EXTRA_WHITE = "Dĩa ức",
    EXTRA_WING = "Dĩa cánh",
    EXTRA_DARK = "Dĩa đùi"
}

export enum Drinks {
    WATER = "Water",
    ICE_WATER = "Ice-water",
    HOT_WATER = "Hot-water",
    ICE_TEA = "Ice-tea",
    HOT_TEA = "Hot-tea",
    COFFEE = "Coffee",
    BLACK_COFEE = "Black-coffee",
    COKE = "Coke",
    DIET_COKE = "Diet-Coke",
    SPRITE = "Sprite",
}

export enum Dessert {
    TOFU = "Tofu regular",
    TOFU_MATCHA = "Tofu matcha",
    TOFU_GINGER = "Tofu ginger",
    COCONUT_JELLY = "Coconut jelly",
    MIXED_JELLY = "Mixed jelly",
    THREE_COLOR = "3 màu"
}

export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    ACTIVE = "ACTIVE"
}

export const BEEF_MEAT = {
    "T": { sort: 1, label: 'Tái' },
    "C": { sort: 2, label: 'Chín' },
    "G`": { sort: 3, label: 'Gầu' },
    "g": { sort: 4, label: 'Gân' },
    "S": { sort: 5, label: 'Sách' },
    "BV": { sort: 6, label: 'Bò viên' },
    "Xi": { sort: 0, label: 'XiQ' }
}

export const BEEF_COMBO = {
    "#1:DB": ['T', 'C', 'G`', 'g', 'S', 'BV'],
    "#2:Tái": ['T'],
    "#3:Tái,Bò viên": ['T', 'BV'],
    "#4:Tái,Chín,Sách": ['T', 'C', 'S'],
    "#5:Tái,Chín,Gầu": ['T', 'C', 'G`'],
    "#6:Tái,Chín,gân": ['T', 'C', 'g'],
    "#7:Xi,Gầu,Bò viên": ['Xi', 'G`', 'BV'],
    "#8a:Hủ tiếu BK": ['Pho BK'],
    "#8b:B.Mì BK": ['B.Mì BK'],
    "#8c:Mì BK": ['Mì BK']
}

export const CHICKEN_COMBO = {
    'Ức': ['U'],
    'Cánh': ['C'],
    'Đùi': ['D'],
}

export const BEEF_NOODLE = ['BC', 'BT', 'BS', 'BTS'];
export const CHICKEN_NOODLE = ['BC', 'BT', 'BS', 'BTS', 'Bún', 'Miến', 'Mì'];

export const BEEF_REFERENCES = {
    'Không hành': 'No H',
    'Không béo': 'No Béo',
    'Ít bánh': '-b',
    'Tái riêng': 'R',
    'Giá sống': 'Giá sống',
    'HD': 'HD',
    'HT': 'HT',
    'Béo': 'Béo',
}
export const CHICKEN_REFERENCES = {
    'Không hành': 'No H',
    'Không béo': 'No Béo',
    'Giá chín': 'Giá chín',
    'HD': 'HD',
    'HT': 'HT',
    'No skin': '0skin',
    'No bone': '0bone',
    'Khô': 'K',
}

export const DefaultPho: Pho = {
    id: '',
    meats: [],
    noodle: "BC",
    preferences: [],
    note: ''
}

export const INIT_SELECTED_ITEM: SelectedItem = {
    beef: new Map(),
    beefSide: new Map(),
    beefUpdated: [],

    chicken: new Map(),
    chickenSide: new Map(),
    chickenUpdated: [],

    drink: new Map(),
    dessert: new Map(),
};