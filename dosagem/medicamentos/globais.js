const medicamentos = {
    "#1": [{
        check: (d, i, p, v) => d === "pediatrica" && p < 5,
        campos: { dose: true, peso: [1, 35], idade: [0, 5110], dosagem: [5, 10, 5, "mg/kg"], intervalo: [12] },
        formula: (p, i, d, h) => p * d
    },
    {
        check: (d, i, p) => d === "adulta",
        campos: { peso: [40, 200], intervalo: [12, 8], dose: true },
        formula: (p, i, d, h) => p / h
    }],
    
    "dipirona": [{
        check: () => true,
        campos: {peso: [1, 300]},
        formula: (p, i, d, h) => (p * 0.04 + " ml")
    }],

    "adrenalina": [{
        check: () => true,
        campos: { peso: [1, 300]},
        formula: (p, i, d, h) => (p * 0.01)*1+` ml`,
    }],

    "atropina (0.25/ml)": [{
        check: () => true,
        campos: { peso: [1, 300]},
        formula: (p, i, d, h) => (p * 0.02)*4+` ml`,
    }],
    
    "dexametasona": [{
        check: () => true,
        campos: { peso: [1, 300], dosagem:[0.15, 0.6, 0.6, "mg/kg"]},
        formula: (p, i, d, h) => (p * d)*0.25+` ml`,
    }],

    "diazepam": [{
        check: () => true,
        campos: { peso: [1, 300], dosagem:[0.2, 0.5, 0.5, "mg/kg"]},
        formula: (p, i, d, h) => ((p * d)*(1/5))+` ml`,
    }],



































};

