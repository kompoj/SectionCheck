const beamObj = {
	dimension: {
		height: 400,
		width: 200,
		covering: 30,
		clearDistanceBetweenBarLayer: 20
	},
	topbar: {
		firstLayerList: [{ diameter: 20, x: "", y: "" }, { diameter: 16, x: "", y: "" }, { diameter: 16, x: "", y: "" }, { diameter: 20, x: "", y: "" }],
		secondLayerList: [{ diameter: 16, x: "", y: "" }, { diameter: 16, x: "", y: "" }],
	},
	bottombar: {
		firstLayerList: [{ diameter: 20, x: "", y: "" }, { diameter: 16, x: "", y: "" }, { diameter: 16, x: "", y: "" }, { diameter: 20, x: "", y: "" }],
		secondLayerList: [{ diameter: 16, x: "", y: "" }, { diameter: 16, x: "", y: "" }],
	},
	stirrup: 9,
	materialStrength: {
		concrete: 28,
		steel: 240
	},


}

document.querySelector("#change-language").addEventListener("click", function () {
	const lang = document.querySelector("html").getAttribute("lang")
	if (lang == "en") {
		document.querySelector("html").setAttribute("lang", "th")
		document.querySelectorAll("[data-language]").forEach(El => {
			let languageData = El.getAttribute("data-language").split("β")
			El.textContent = El.textContent.replace(languageData[0], languageData[1])
		})
	} else {
		document.querySelector("html").setAttribute("lang", "en")
		document.querySelectorAll("[data-language]").forEach(El => {
			let languageData = El.getAttribute("data-language").split("β")
			El.textContent = El.textContent.replace(languageData[1], languageData[0])
		})
	}
})

document.querySelector('#calculateAndUpdateResult').addEventListener('click', function () {
	calculateAndUpdateResult()
})
document.querySelector('#redrawSVG').addEventListener('click', function () {
	redrawSVG()
})


inititialize()
function inititialize() {
	retriveAllDataFromDatabaseToInputEl()
	calculateAndUpdateResult()
	redrawSVG()
}


function retriveAllDataFromDatabaseToInputEl() {
	document.querySelectorAll('.inputBox').forEach(El => {
		retriveOneDataFromDatabaseToInputEl(El)
	})
}

function retriveOneDataFromDatabaseToInputEl(El) {
	const storepath = El.getAttribute('data-storepath').split('β')
	const command = El.getAttribute('data-command')

	if (retrive(beamObj, storepath, command) != "don't have any value to be retrived" && retrive(beamObj, storepath, command) != 0) {
		El.value = retrive(beamObj, storepath, command)
	}
}

// document.querySelector("input#height").setAttribute("style", "margin-right:71px");
// document.querySelector("input#height").style.marginLeft = "30px";

document.querySelectorAll(".inputBox").forEach(El => {
	El.addEventListener("focus", function (e) {
		El.classList.add("modified")

		document.querySelectorAll(".outputBox").forEach(El => {
			El.classList.add("modified")
		})
	})



	El.addEventListener("input", function (e) {
		inputDataToDatabase(El)
		retriveAllDataFromDatabaseToInputEl()
		calculateAndUpdateResult()
		redrawSVG()
	})

	El.addEventListener('wheel', () => { })
})

function inputDataToDatabase(El) {
	const storepath = El.getAttribute("data-storepath").split('β')
	const command = El.getAttribute("data-command")
	assign(beamObj, storepath, El.value * 1, command)
}

function calculateAndUpdateResult() {
	beamObj.dimension.area = beamObj.dimension.height * 1 * beamObj.dimension.width * 1;
	beamObj.dimension.parameter = 2 * (beamObj.dimension.height * 1 + beamObj.dimension.width * 1);

	let topFirstLayerMaxDia = 0

	for (let i = 0; i < beamObj.topbar.firstLayerList.length; i++) {
		// x position calculation
		if (beamObj.topbar.firstLayerList.length == 1) {
			beamObj.topbar.firstLayerList[i].x = beamObj.dimension.width / 2
		} else if (beamObj.topbar.firstLayerList.length >= 2) {
			let horizontalLength = beamObj.dimension.width - beamObj.dimension.covering * 2 - beamObj.stirrup * 2 - beamObj.topbar.firstLayerList[0].diameter / 2 - beamObj.topbar.firstLayerList.at(-1).diameter / 2
			let horizontalBarSpacing = horizontalLength / (beamObj.topbar.firstLayerList.length - 1)

			beamObj.topbar.firstLayerList[i].x = beamObj.dimension.covering + beamObj.stirrup + beamObj.topbar.firstLayerList[0].diameter / 2 + horizontalBarSpacing * i
		}


		// y position calculation
		beamObj.topbar.firstLayerList[i].y = beamObj.dimension.covering * 1 + beamObj.stirrup + beamObj.topbar.firstLayerList[i].diameter * 1 / 2
		if (beamObj.topbar.firstLayerList[i].diameter * 1 > topFirstLayerMaxDia) {
			topFirstLayerMaxDia = beamObj.topbar.firstLayerList[i].diameter * 1
		}
	}

	for (let i = 0; i < beamObj.topbar.secondLayerList.length; i++) {
		if (beamObj.topbar.secondLayerList.length == 1) {
			beamObj.topbar.secondLayerList[i].x = beamObj.dimension.width / 2
		} else if (beamObj.topbar.secondLayerList.length >= 2) {
			let horizontalLength = beamObj.dimension.width - beamObj.dimension.covering * 2 - beamObj.stirrup * 2 - beamObj.topbar.secondLayerList[0].diameter / 2 - beamObj.topbar.secondLayerList.at(-1).diameter / 2
			let horizontalBarSpacing = horizontalLength / (beamObj.topbar.secondLayerList.length - 1)

			beamObj.topbar.secondLayerList[i].x = beamObj.dimension.covering + beamObj.stirrup + beamObj.topbar.secondLayerList[0].diameter / 2 + horizontalBarSpacing * i
		}

		beamObj.topbar.secondLayerList[i].y = beamObj.dimension.covering * 1 + topFirstLayerMaxDia + beamObj.dimension.clearDistanceBetweenBarLayer * 1 + beamObj.topbar.secondLayerList[i].diameter * 1 / 2
	}

	let bottomFirstLayerMaxDia = 0

	for (let i = 0; i < beamObj.bottombar.firstLayerList.length; i++) {
		let horizontalBarSpacing = beamObj.dimension.width / (beamObj.bottombar.firstLayerList.length - 1)

		beamObj.bottombar.firstLayerList[i].x = horizontalBarSpacing * i
		beamObj.bottombar.firstLayerList[i].y = beamObj.dimension.height - (beamObj.dimension.covering * 1 + beamObj.bottombar.firstLayerList[i].diameter * 1 / 2)
		if (beamObj.bottombar.firstLayerList[i].diameter * 1 > bottomFirstLayerMaxDia) {
			bottomFirstLayerMaxDia = beamObj.bottombar.firstLayerList[i].diameter * 1
		}
	}

	for (let i = 0; i < beamObj.bottombar.secondLayerList.length; i++) {
		let horizontalBarSpacing = beamObj.dimension.width / (beamObj.bottombar.secondLayerList.length - 1)

		beamObj.bottombar.secondLayerList[i].x = horizontalBarSpacing * i
		beamObj.bottombar.secondLayerList[i].y = beamObj.dimension.height - (beamObj.dimension.covering * 1 + bottomFirstLayerMaxDia + beamObj.dimension.clearDistanceBetweenBarLayer * 1 + beamObj.bottombar.secondLayerList[i].diameter * 1 / 2)
	}

	// for (let i = 0; i < topBottom.length; i++) {
	// 	for (let j = 0; j < firstSecond.length; j++) {
	// 		horizontalBarSpacing = beamObj.dimension.width / (beamObj[topBottom[i]][firstSecond[j]].length - 1)

	// 		beamObj[topBottom[i]][firstSecond[j]].forEach(function (El, index) {
	// 			beamObj[topBottom[i]][firstSecond[j]][index].x = horizontalBarSpacing * index
	// 			beamObj[topBottom[i]][firstSecond[j]][index].y = beamObj.dimension.covering * 1 + beamObj[topBottom[i]][firstSecond[j]][index].diameter * 1 / 2
	// 		})
	// 	}
	// }
	console.log("finished calculating result")

	ResultPrintOutToOutputEl()
}

function ResultPrintOutToOutputEl() {
	document.querySelectorAll(".outputBox").forEach(EL => {
		EL.innerHTML = retrive(beamObj, EL.getAttribute("data-storepath").split('β'))
	})
}



function assign(returnObj, storepath, value, command) {
	const unreplacedstorepath = storepath


	for (let i = 0; i < storepath.length - 1; i++) {

		if (storepath[i][0] != "^") {

			if (!(storepath[i] in returnObj)) {
				returnObj[storepath[i]] = {}
			}
			returnObj = returnObj[storepath[i]]
			// console.log(returnObj)


		} else if (storepath[i][0] === "^") {
			storepath[i] = storepath[i].toString().replace("^", "")
			// console.log(storepath[i])
			if (!(storepath[i] in returnObj)) {
				returnObj[storepath[i]] = []
			}
			returnObj = returnObj[storepath[i]]
		}
	}

	// go to deepest level of storepath
	const deepestPathName = storepath[storepath.length - 1].toString().replace("^", "")
	// → returnObj[deepestPathName]
	if (!(Array.isArray(returnObj[deepestPathName]))) {
		returnObj[deepestPathName] = value
		// console.log(returnObj[deepestPathName])
	} else {

		if (command == "changeBarDiameter") {
			for (let i = 0; i < returnObj[deepestPathName].length; i++) {
				returnObj[deepestPathName][i].diameter = value
			}

		} else if (command == "changeArrayLength") {
			while (returnObj[deepestPathName].length < value) {
				if (returnObj[deepestPathName].length != 0) {
					returnObj[deepestPathName].push({ diameter: returnObj[deepestPathName][returnObj[deepestPathName].length - 1].diameter })
				} else {
					// console.log(unreplacedstorepath.join("β"))
					if (document.querySelectorAll(`[data-storepath= '${unreplacedstorepath.join("β")}']`)[0].value * 1 > 0) {
						returnObj[deepestPathName].push({ diameter: document.querySelectorAll(`[data-storepath= '${unreplacedstorepath.join("β")}']`)[0].value * 1 })
					} else {
						returnObj[deepestPathName].push({ diameter: 20, x: "", y: "" })
					}
				}
			}

			while (returnObj[deepestPathName].length > value) {
				returnObj[deepestPathName].pop()
			}

			// console.log(returnObj[deepestPathName].length)

			// returnObj[deepestPathName][storepath[storepath.length - 1]].forEach(item => {
			// 	item = value
			// })
		}
	}
	console.log(beamObj)

}


function retrive(returnObj, storepath, command) {
	for (let i = 0; i < storepath.length - 1; i++) {
		storepath[i] = storepath[i].toString().replace("^", "")
		returnObj = returnObj[storepath[i]]
	}

	// go to deepest level of storepath
	const deepestPathName = storepath[storepath.length - 1].toString().replace("^", "")
	if (!(Array.isArray(returnObj[deepestPathName]))) {
		return returnObj[deepestPathName]
	} else {
		if (command == "changeBarDiameter") {
			let boolean = true
			for (let i = 0; i < returnObj[deepestPathName].length - 1; i++) {
				if (returnObj[deepestPathName][i].diameter != returnObj[deepestPathName][i + 1].diameter) {
					boolean = false
					break
				}
			}

			if (boolean) {
				if (returnObj[deepestPathName].length == 0) {
					return "don't have any value to be retrived"
				} else {
					return returnObj[deepestPathName][0].diameter
				}
			} else {
				return -1
			}


		} else if (command == "changeArrayLength") {
			return returnObj[deepestPathName].length
		}
		console.log(beamObj)
	}
}


function redrawSVG() {
	redrawSVGRect()
	redrawSVGbar()
}

function redrawSVGRect() {
	const svg = document.querySelector(".section-svg")
	const strokeWidth = 3
	// const strokeWidth = Math.max(beamObj.dimension.height, beamObj.dimension.width) / 100
	svg.setAttribute("viewBox", `${-strokeWidth / 2} ${-strokeWidth / 2} ${beamObj.dimension.width + strokeWidth} ${beamObj.dimension.height + strokeWidth}`);

	const parameter_rect = svg.querySelector(".parameter-rect")
	parameter_rect.setAttribute("width", beamObj.dimension.width)
	parameter_rect.setAttribute("height", beamObj.dimension.height)
	parameter_rect.setAttribute("stroke-width", strokeWidth)
	parameter_rect.setAttribute("rx", 5)

	const outer_stirrup_rect = svg.querySelector(".outer-stirrup-rect")
	outer_stirrup_rect.setAttribute("width", beamObj.dimension.width - beamObj.dimension.covering * 2)
	outer_stirrup_rect.setAttribute("height", beamObj.dimension.height - beamObj.dimension.covering * 2)
	outer_stirrup_rect.setAttribute("x", beamObj.dimension.covering)
	outer_stirrup_rect.setAttribute("y", beamObj.dimension.covering)
	outer_stirrup_rect.setAttribute("rx", 15)

	const inner_stirrup_rect = svg.querySelector(".inner-stirrup-rect")
	inner_stirrup_rect.setAttribute("width", beamObj.dimension.width - beamObj.dimension.covering * 2 - beamObj.stirrup * 2)
	inner_stirrup_rect.setAttribute("height", beamObj.dimension.height - beamObj.dimension.covering * 2 - beamObj.stirrup * 2)
	inner_stirrup_rect.setAttribute("x", beamObj.dimension.covering + beamObj.stirrup)
	inner_stirrup_rect.setAttribute("y", beamObj.dimension.covering + beamObj.stirrup)
	inner_stirrup_rect.setAttribute("rx", 10)
}
function redrawSVGbar() {
	console.log("start drawing SVG")

	const TB = ["topbar", "bottombar"]
	const FS = ["firstLayerList", "secondLayerList"]

	for (let i = 0; i < TB.length; i++) {
		for (let j = 0; j < FS.length; j++) {
			const svgBarLayerGroup = document.querySelector(`.section-svg g.${TB[i]}.${FS[j]}`)

			// console.log(beamObj[TB[i]][FS[j]])
			let string = ""
			for (let index = 0; index < beamObj[TB[i]][FS[j]].length; index++) {
				string += `<circle class='' cx='${beamObj[TB[i]][FS[j]][index].x * 1}' cy='${beamObj[TB[i]][FS[j]][index].y * 1}' r='${beamObj[TB[i]][FS[j]][index].diameter * 1 / 2}'
						data-storepath='${TB[i]}β^${FS[j]}β${index}βdiameter' />`
			}
			svgBarLayerGroup.innerHTML = string



			svgBarLayerGroup.querySelectorAll(`.section-svg g.${TB[i]}.${FS[j]} circle`).forEach(circleEl => {
				circleEl.addEventListener("click", function (e) {
					const storepath = circleEl.getAttribute("data-storepath").split("β")

					let newDiameter = prompt("Please enter new diameter", retrive(beamObj, storepath));
					if (newDiameter != null) {
						assign(beamObj, storepath, newDiameter * 1)
						retriveAllDataFromDatabaseToInputEl()
						calculateAndUpdateResult()
						redrawSVG()
					}

				})

				circleEl.addEventListener("mouseover", function (e) {
					console.log("mouseover")
				})

			})
		}
	}

}











