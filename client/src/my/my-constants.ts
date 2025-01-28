export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    ACTIVE = "ACTIVE",
    DONE = "DONE",
}

export enum SCREEN { DEFAULT, SERVER, MENU, HISTORY_ORDER }

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
    "#8a:Hủ tiếu BK": ['BK'],
    "#8b:Bánh Mì BK": ['BK'],
    "#8c:Mì BK": ['BK']
}

export const CHICKEN_COMBO = {
    'Ức': [{ code: 'U', price: '13.5' }],
    'Cánh': [{ code: 'C', price: '14.5' }],
    'Đùi': [{ code: 'D', price: '16.5' }],
}

export const BEEF_NOODLE = ['BC', 'BT', 'BS', 'BTS'];
export const CHICKEN_NOODLE = ['BC', 'BT', 'BS', 'BTS', 'Bún', 'Miến', 'Mì'];

export const BEEF_REFERENCES = {
    'Không hành': { sort: 4, code: '0onion', },
    'Không béo': { sort: 5, code: '0Béo', },
    'Ít bánh': { sort: 3, code: '-b', },
    'Tái riêng': { sort: 2, code: 'T-r', },
    'Tái băm': { sort: 1, code: 'T-bam', },
    'Tái cook': { sort: 1, code: 'T-cook', },
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
    'Ch.Bánh': { price: '3' },
    'Ch.BT': { price: '3' },
    'Ch.Egg': { price: '2' },
    'Bread': { price: '1.25' },
    'Ch.Soup': {},
    'Large.Soup': {},
    'Egg rolls': { price: '5.95' },
    '1 Egg roll': {}
}
export const BEEF_MEAT_SIDE = {
    'Dĩa Tái': { code: "Dĩa T", price: '5.00' },
    'Chén Tái': { code: "Ch.T", price: '5.00' },
    'Chén Chín': { code: "Ch.C" },
    'Chén Gầu': { code: "Ch.G`" },
    'Chén Gân': { code: "Ch.g" },
    'Chén Sách': { code: "Ch.S" },
    'Chén BV': { code: "Ch.BV", price: "4.00" }
}

export const CHICKEN_SIDE = {
    "Giá trụng": null
}
export const CHICKEN_SIDE_2 = {
    "Extra bamboo": { price: '3' },
    "Extra soup": { price: '3' },
    "Extra BC": { price: '3' },
    "Extra BT": { price: '3' },
    "Extra Bún": { price: '3' },
    "Extra Miến": { price: '3' },
    "Extra Mì": { price: '3' },
}
export const CHICKEN_SIDE_3 = {
    "Dĩa ức": { code: 'Dia.U', price: '7.49' },
    'Dĩa cánh': { code: 'Dia.C', price: '8.49' },
    'Dĩa đùi': { code: 'Dia.D', price: '9.49' }
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
    'Coffee': { price: '4.5' },
    'Black-coffee': { price: '4.5' },
    'Hot Coffee': { price: '4.5' },
    'Hot Black-coffee': { price: '4.5' },
}
const SOFT_DRINK = {
    'Coke': { price: '2.5' },
    'Diet-Coke': { price: '2.5' },
    'Sprite': { price: '2.5' },
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
    'Mixed jelly': {},
}

export const PRINTER = {
    'beef': null,
    'chicken': null,
    'vegetable': null,
    'beverage': null
}

export const MENU = {
    'BEEF': {
        'pho': {
            'combo': BEEF_COMBO,
            'meat': BEEF_MEAT,
            'noodle': BEEF_NOODLE,
            'reference': BEEF_REFERENCES
        },
        'nonPho': [BEEF_DINE_IN, BEEF_SIDE, BEEF_MEAT_SIDE],
        'printers': ['beef', 'vegetable']
    },
    'CHICKEN': {
        'pho': {
            'combo': CHICKEN_COMBO,
            'meat': null,
            'noodle': CHICKEN_NOODLE,
            'reference': CHICKEN_REFERENCES
        },
        'nonPho': [CHICKEN_SIDE, CHICKEN_SIDE_2, CHICKEN_SIDE_3, CHICKEN_SIDE_4],
        'printers': ['chicken', 'vegetable']
    },
    'DRINK': {
        'pho': null,
        'nonPho': [WATER, TEA, COFFEE, SOFT_DRINK, CHE, TOFU, DESSERT],
        'printers': ['beverage']
    }
}