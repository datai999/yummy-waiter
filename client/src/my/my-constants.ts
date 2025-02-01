export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    ACTIVE = "ACTIVE",
    DONE = "DONE",
}

export enum SCREEN { DEFAULT, SERVER, MENU, HISTORY_ORDER }

export const BEEF_MEAT = {
    "Tái": { "sort": 1, "code": "T" },
    "Chín": { "sort": 2, "code": "C" },
    "Gầu": { "sort": 3, "code": "G`" },
    "Gân": { "sort": 4, "code": "g^" },
    "Sách": { "sort": 5, "code": "S" },
    "BV": { "sort": 6, "code": "BV" },
    "Xi": { "sort": 0, "code": "Xi" }
}

const PRINTER = {
    "beef": null,
    "chicken": null,
    "vegetable": null,
    "beverage": null
}

export const MENU = {
    "BEEF": {
        "pho": {
            "combo": {
                "#1:DB": ["Tái", "Chín", "Gầu", "Gân", "Sách", "BV"],
                "#2:Tái": ["Tái"],
                "#3:Tái,Bò viên": ["Tái", "BV"],
                "#4:Tái,Chín,Sách": ["Tái", "Chín", "Sách"],
                "#5:Tái,Chín,Gầu": ["Tái", "Chín", "Gầu"],
                "#6:Tái,Chín,gân": ["Tái", "Chín", "Gân"],
                "#7:Xi,Gầu,Bò viên": ["Xi", "Gầu", "BV"],
                "#8a:Hủ tiếu BK": ["BK"],
                "#8b:Bánh Mì BK": ["BK"],
                "#8c:Mì BK": ["BK"]
            },
            "meat": {
                "Tái": { "sort": 1, "code": "T" },
                "Chín": { "sort": 2, "code": "C" },
                "Gầu": { "sort": 3, "code": "G`" },
                "Gân": { "sort": 4, "code": "g^" },
                "Sách": { "sort": 5, "code": "S" },
                "BV": { "sort": 6, "code": "BV" },
                "Xi": { "sort": 0, "code": "Xi" }
            },
            "noodle": ["BC", "BT", "BS", "BTS"],
            "reference": {
                "Không hành": { "sort": 4, "code": "0onion" },
                "Không béo": { "sort": 5, "code": "0Béo" },
                "Ít bánh": { "sort": 3, "code": "-b" },
                "Tái riêng": { "sort": 2, "code": "T-r" },
                "Tái băm": { "sort": 1, "code": "T-bam" },
                "Tái cook": { "sort": 1, "code": "T-cook" }
            }
        },
        "nonPho": [
            { "HD": null, "HT": null, "NB": null, "Giá sống": null },
            {
                "XiQ": { "price": "6" },
                "Ch.Bánh": { "price": "3" },
                "Ch.BT": { "price": "3" },
                "Ch.Egg": { "price": "2" },
                "Bread": { "price": "1.25" },
                "Ch.Soup": {},
                "Large.Soup": {},
                "Egg rolls": { "price": "5.95" },
                "1 Egg roll": {}
            },
            {
                "Dĩa Tái": { "code": "Dĩa T", "price": "5.00" },
                "Chén Tái": { "code": "Ch.T", "price": "5.00" },
                "Chén Chín": { "code": "Ch.C" },
                "Chén Gầu": { "code": "Ch.G`" },
                "Chén Gân": { "code": "Ch.g" },
                "Chén Sách": { "code": "Ch.S" },
                "Chén BV": { "code": "Ch.BV", "price": "4.00" }
            }
        ]
    },
    "CHICKEN": {
        "pho": {
            "combo": {
                "Ức": [{ "code": "U", "price": "13.5" }],
                "Cánh": [{ "code": "C", "price": "14.5" }],
                "Đùi": [{ "code": "D", "price": "16.5" }]
            },
            "meat": null,
            "noodle": ["BC", "BT", "BS", "BTS", "Bún", "Miến", "Mì"],
            "reference": {
                "Không hành": { "sort": 5, "code": "0onion" },
                "Không da": { "sort": 3, "code": "0skin" },
                "Không xương": { "sort": 2, "code": "0bone" },
                "Măng": { "sort": 4, "code": "bambo" },
                "Khô": { "sort": 1, "code": "dry" }
            }
        },
        "nonPho": [
            { "Giá trụng": null },
            {
                "Extra bamboo": { "price": "3" },
                "Extra soup": { "price": "3" },
                "Extra BC": { "price": "3" },
                "Extra BT": { "price": "3" },
                "Extra Bún": { "price": "3" },
                "Extra Miến": { "price": "3" },
                "Extra Mì": { "price": "3" }
            },
            {
                "Dĩa ức": { "code": "Dia.U", "price": "7.49" },
                "Dĩa cánh": { "code": "Dia.C", "price": "8.49" },
                "Dĩa đùi": { "code": "Dia.D", "price": "9.49" }
            },
            {
                "Half chicken": { "price": "13.5" },
                "Half chicken: Chop": { "price": "13.5" },
                "Whole chicken": { "price": "27" },
                "Whole chicken: Chop": { "price": "27" }
            }
        ]
    },
    "DRINK": {
        "pho": null,
        "nonPho": [
            { "Water": null, "Ice-water": null, "Warm-water": null, "Hot-water": null },
            { "Ice-tea": null, "Hot-tea": null },
            {
                "Coffee": { "price": "4.5" },
                "Black-coffee": { "price": "4.5" },
                "Hot Coffee": { "price": "4.5" },
                "Hot Black-coffee": { "price": "4.5" }
            },
            {
                "Coke": { "price": "2.5" },
                "Diet-Coke": { "price": "2.5" },
                "Sprite": { "price": "2.5" }
            },
            {
                "Tofu soybean": { "price": "3" },
                "Tofu matcha": { "price": "3" },
                "Tofu ginger": { "price": "3" },
                "Tofu mini": { "price": "2", "disabled": true }
            },
            {
                "Chè 3M": { "price": "6" },
                "Chè Yummy": { "price": "6" },
                "Chè SSBL": { "price": "6" }
            },
            {
                "FLan": { "price": "3" },
                "Coconut jelly": { "price": "3" },
                "Mixed jelly": { "price": "6.5" }
            }
        ]
    }
}