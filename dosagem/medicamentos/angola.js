const medAngola = {
    "#1": [{
            check: (d, i, p, v) => d === "pediatrica" && p < 5,
            campos: { dose: true, peso: [1, 35], idade: [0, 5110], dosagem: [5, 10, 5, "mg/kg"], intervalo: [12] },
            formula: (p, i, d, h) => p * d },
        {
            check: (d, i, p) => d === "adulta",
            campos: { peso: [40, 200], intervalo: [12, 8], dose: true },
            formula: (p, i, d, h) => p / h}],
        
    "dipirona": [{
        check: () => true, campos: {peso:[1,300]},
        formula: (p, i, d, h) => p*0.5+" ml / Angola",
    },]
};
