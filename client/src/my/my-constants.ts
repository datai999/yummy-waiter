export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    ACTIVE = "ACTIVE",
    DONE = "DONE",
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
    "#8b:Bánh Mì BK": ['B.Mì BK'],
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
    'Không hành': { sort: 4, code: '0onion', },
    'Không béo': { sort: 5, code: '0Béo', },
    'Ít bánh': { sort: 3, code: '-b', },
    'Tái riêng': { sort: 2, code: 'R', },
    'Tái băm': { sort: 1, code: 'Bam', },
}
export const CHICKEN_REFERENCES = {
    'Không hành': { sort: 5, code: '0onion', },
    'Không da': { sort: 3, code: '0skin', },
    'Không xương': { sort: 2, code: '0bone', },
    'Măng': { sort: 4, code: 'bambo', },
    'Khô': { sort: 1, code: 'dry', },
}

export const BEEF_DINE_IN = {
    'HD': 'HD',
    'HT': 'HT',
    'NB': 'NB',
    'Giá sống': 'Giá sống',
}
export const BEEF_SIDE = {
    'XiQ': 'XiQ',
    'Ch.Bánh': 'Ch.Bánh',
    'Ch.BT': 'Ch.BT',
    'Ch.Egg': 'Ch.Egg',
    'Bread': 'Bread',
    'Ch.Soup': 'Ch.Soup',
    'Large.Soup': 'Large Soup',
    'Egg rolls': 'Egg rolls',
    '1 Egg roll': '1 Egg roll',
    '?': '?',
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
    "Giá trụng": "Giá trụng"
}
export const CHICKEN_SIDE_2 = {
    "Extra bamboo": "Extra bamboo",
    "Extra noodle": "Extra noodle",
}
export const CHICKEN_SIDE_3 = {
    "Dĩa ức": 'Dia.U',
    'Dĩa cánh': 'Dia.C',
    'Dĩa đùi': 'Dia.D'
}
export const CHICKEN_SIDE_4 = {
    "Half chicken": 'Half chicken',
    "Half chicken: Chop": 'Half chicken: Chop',
    "Whole chicken": 'Whole chicken',
    "Whole chicken: Chop": 'Whole chicken: Chop',
}

export const WATER = {
    'Water': 'Water',
    'Ice-water': 'Ice-water',
    'Warm-water': 'Warm-water',
    'Hot-water': 'Hot-water'
}
const TEA = {
    'Ice-tea': 'Ice-tea',
    'Hot-tea': 'Hot-tea',
}
const COFFEE = {
    'Coffee': 'Coffee',
    'Black-coffee': 'Black-coffee',
    'Hot Coffee': 'Hot Coffee',
    'Hot Black-coffee': 'Hot Black-coffee',
}
const SOFT_DRINK = {
    'Coke': 'Coke',
    'Diet-Coke': 'Diet-Coke',
    'Sprite': 'Sprite'
}
const TOFU = {
    'Tofu soybean': 'Tofu soybean',
    'Tofu matcha': 'Tofu matcha',
    'Tofu ginger': 'Tofu ginger',
}
const CHE = {
    'Chè 3M': 'Chè 3M',
    'Chè Yummy': 'Chè Yummy',
    'Chè SSBL': 'Chè SSBL',
}

export const DESSERT = {
    'FLan': 'Flan',
    'Coconut jelly': 'Coconut jelly',
    'Mixed jelly': 'Mixed jelly',
}

export const MENU = {
    'BEEF': {
        'pho': {
            'combo': BEEF_COMBO,
            'meat': BEEF_MEAT,
            'noodle': BEEF_NOODLE,
            'reference': BEEF_REFERENCES
        },
        'nonPho': [BEEF_DINE_IN, BEEF_SIDE, BEEF_MEAT_SIDE]
    },
    'CHICKEN': {
        'pho': {
            'combo': CHICKEN_COMBO,
            'meat': null,
            'noodle': CHICKEN_NOODLE,
            'reference': CHICKEN_REFERENCES
        },
        'nonPho': [CHICKEN_SIDE, CHICKEN_SIDE_2, CHICKEN_SIDE_3, CHICKEN_SIDE_4]
    },
    'DRINK': {
        'pho': null,
        'nonPho': [WATER, TEA, COFFEE, SOFT_DRINK, CHE, TOFU, DESSERT]
    }
}