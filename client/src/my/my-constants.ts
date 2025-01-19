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
    'HD': null,
    'HT': null,
    'NB': null,
    'Giá sống': null,
}
export const BEEF_SIDE = {
    'XiQ': { price: '6' },
    'Ch.Bánh': null,
    'Ch.BT': null,
    'Ch.Egg': null,
    'Bread': null,
    'Ch.Soup': null,
    'Large.Soup': null,
    'Egg rolls': null,
    '1 Egg roll': null,
    '?': '?',
}
export const BEEF_MEAT_SIDE = {
    'Dĩa Tái': { code: "Dĩa T" },
    'Chén Tái': { code: "Ch.T" },
    'Chén Chín': { code: "Ch.C" },
    'Chén Gầu': { code: "Ch.G`" },
    'Chén Gân': { code: "Ch.g" },
    'Chén Sách': { code: "Ch.S" },
    'Chén BV': { code: "Ch.BV" }
}

export const CHICKEN_SIDE = {
    "Giá trụng": null
}
export const CHICKEN_SIDE_2 = {
    "Extra bamboo": { price: '9999' },
    "Extra noodle": { price: '9999' },
}
export const CHICKEN_SIDE_3 = {
    "Dĩa ức": { code: 'Dia.U' },
    'Dĩa cánh': { code: 'Dia.C' },
    'Dĩa đùi': { code: 'Dia.D' }
}
export const CHICKEN_SIDE_4 = {
    "Half chicken": { price: '13.5' },
    "Half chicken: Chop": { price: '13.5' },
    "Whole chicken": { price: '27' },
    "Whole chicken: Chop": { price: '27' },
}

export const WATER = {
    'Water': null,
    'Ice-water': null,
    'Warm-water': null,
    'Hot-water': null
}
const TEA = {
    'Ice-tea': null,
    'Hot-tea': null
}
const COFFEE = {
    'Coffee': { price: '6' },
    'Black-coffee': { price: '6' },
    'Hot Coffee': { price: '6' },
    'Hot Black-coffee': { price: '6' },
}
const SOFT_DRINK = {
    'Coke': { price: '3' },
    'Diet-Coke': { price: '3' },
    'Sprite': { price: '3' },
}
const TOFU = {
    'Tofu soybean': { price: '3' },
    'Tofu matcha': { price: '3' },
    'Tofu ginger': { price: '3' },
}
const CHE = {
    'Chè 3M': { price: '6' },
    'Chè Yummy': { price: '6' },
    'Chè SSBL': { price: '6' },
}

export const DESSERT = {
    'FLan': { price: '3' },
    'Coconut jelly': { price: '3' },
    'Mixed jelly': { price: '6' },
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