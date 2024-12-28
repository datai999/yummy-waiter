import { SelectedItem } from "./my-class";

export enum Categories {
    BEEF = "BEEF",
    CHICKEN = "CHICKEN",
    // SIDE_ORDERS = "SIDE_ORDERS",
    DRINKS = "DRINKS"
}

export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    ACTIVE = "ACTIVE"
}

export const BEEF_MEAT = {
    "Tái": { sort: 1, code: 'T' },
    "Chín": { sort: 2, code: 'C' },
    "Gầu": { sort: 3, code: 'G`' },
    "Gân": { sort: 4, code: 'g^' },
    "Sách": { sort: 5, code: 'S' },
    "BV": { sort: 6, code: 'BV' },
    "Xi": { sort: 0, code: 'Xi' }
}

export const BEEF_COMBO = {
    "#1:DB": ['Tái', 'Chín', 'Gầu', 'Gân', 'Sách', 'BV'],
    "#2:Tái": ['Tái'],
    "#3:Tái,Bò viên": ['Tái', 'BV'],
    "#4:Tái,Chín,Sách": ['Tái', 'Chín', 'Sách'],
    "#5:Tái,Chín,Gầu": ['Tái', 'Chín', 'Gầu'],
    "#6:Tái,Chín,gân": ['Tái', 'Chín', 'Gân'],
    "#7:Xi,Gầu,Bò viên": ['Xi', 'Gầu', 'BV'],
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
    'Không hành': '0h',
    'Không béo': '0Béo',
    'Ít bánh': '-b',
    'Tái riêng': 'R'
}
export const CHICKEN_REFERENCES = {
    'Không hành': '0h',
    'Không da': '0Skin',
    'Không xương': '0bone',
    'Khô': 'K'
}

export const BEEF_SIDE = {
    'HD': 'HD',
    'HT': 'HT',
    'NB': 'NB',
    'Giá sống': 'Giá sống',
    'XiQ': 'XiQ',
    'Ch.Bánh': 'Ch.Bánh',
    'Ch.BT': 'Ch.BT',
    'Ch.Egg': 'Ch.Egg',
    'Bread': 'Bread',
    'Ch.Soup': 'Ch.Soup',
    'Small.Soup': 'Small Soup',
    'Large.Soup': 'Large Soup',
}

export const BEEF_MEAT_SIDE = {
    'Dĩa Tái': "Dĩa T",
    'Chén Tái': "Ch.T",
    'Chén Chín': "Ch.C",
    'Chén Gầu': "Ch.G`",
    'Chén Gân': "Ch.g",
    'Chén Sách': "Ch.S",
    'Chén BV': "Ch.BV"
}

export const CHICKEN_SIDE = {
    "Giá trụng": "Giá trụng",
    'HD': 'HD',
    "Extra bamboo": "Extra bamboo",
    "Whole chicken": 'Whole chicken',
    "Half chicken": 'Half chicken',
    "Dĩa ức": 'Dia.U',
    'Dĩa cánh': 'Dia.C',
    'Dĩa đùi': 'Dia.D'
}

export const DRINK = {
    'Water': 'Water',
    'Ice-water': 'Ice-water',
    'Hot-water': 'Hot-water',
    'Ice-tea': 'Ice-tea',
    'Hot-tea': 'Hot-tea',
    'Coffee': 'Coffee',
    'Black-coffee': 'Black-coffee',
    'Coke': 'Coke',
    'Diet-Coke': 'Diet-Coke',
    'Sprite': 'Sprite'
}

export const DESSERT = {
    'Tofu soybean': 'Tofu soybean',
    'Tofu matcha': 'Tofu matcha',
    'Tofu ginger': 'Tofu ginger',
    'Coconut jelly': 'Coconut jelly',
    'Mixed jelly': 'Mixed jelly',
    'Three color': 'Three color'
}

export const CATEGORY = {
    'BEEF': {
        'pho': {
            'combo': BEEF_COMBO,
            'meat': BEEF_MEAT,
            'noodle': BEEF_NOODLE,
            'reference': BEEF_REFERENCES
        },
        'nonPho': [BEEF_SIDE, BEEF_MEAT_SIDE]
    },
    'CHICKEN': {
        'pho': {
            'combo': CHICKEN_COMBO,
            'meat': null,
            'noodle': CHICKEN_NOODLE,
            'reference': CHICKEN_REFERENCES
        },
        'nonPho': [CHICKEN_SIDE]
    },
    'DRINK': {
        'pho': null,
        'nonPho': [DRINK]
    }
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