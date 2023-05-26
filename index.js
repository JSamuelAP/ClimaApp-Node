require("dotenv").config();
const {
	inquirerMenu,
	leerInput,
	pausa,
	listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
	let opt;
	const busquedas = new Busquedas();

	do {
		console.clear();
		opt = await inquirerMenu();

		switch (opt) {
			case 1: // Buscar ciudad
				// Mostrar mensaje
				const termino = await leerInput("Ciudad:");

				// Buscar los lugares
				const lugares = await busquedas.ciudad(termino);

				// Seleccionar el lugar
				const id = await listarLugares(lugares);
				if (id === "0") continue;
				const lugarSel = lugares.find((lugar) => lugar.id == id);

				// Guardar en DB
				busquedas.agregarHistorial(lugarSel.nombre);

				// Clima
				const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

				// Mostrar resultados
				console.log("\nInformación de la ciudad".green);
				console.log("Ciudad:", lugarSel.nombre.blue);
				console.log("Lat:", lugarSel.lat);
				console.log("Lng:", lugarSel.lng);
				console.log("Temperatura: ", clima.temp, "°C".green);
				console.log("Min:", clima.min, "°C".green);
				console.log("Max:", clima.max, "°C".green);
				console.log("Como está el clima:", clima.desc.blue);

				break;
			case 2: // Historial
				busquedas.historialCapitalizado.forEach((lugar, i) => {
					const idx = `${i + 1}.`.green;
					console.log(`${idx} ${lugar}`);
				});
				break;
		}

		if (opt !== 0) await pausa();
	} while (opt !== 0);
};

main();
