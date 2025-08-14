//import { UltraHonkBackend } from '@aztec/bb.js';
//import { Noir } from '@noir-lang/noir_js';
//import circuit from "./circuit/target/circuit.json";

const show = (id, content) => {
    const container = document.getElementById(id);
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};

var prove = async () => {
    try {
        //show("proveArea", "Oh 💔 : " + e);
        const noir = new Noir(circuit);
        const backend = new UltraHonkBackend(circuit.bytecode);
        const move_count = ms.length;
        const init_grid = p.init_position;
        const move_array = new Array(1024).fill(0);
        for (let m of ms) {
            move_array.push(m);
        }
        show("proveArea", "Generating witness... ⏳");
        const { witness } = await noir.execute({ move_count, init_grid, move_array });
        show("proveArea", "Generated witness... ✅");
        show("proveArea", "Generating proof... ⏳");
        const proof = await backend.generateProof(witness);
        show("proveArea", "Generated proof... ✅");
        document.getElementById("proveResultArea").textContent = proof.proof;
        //show("proveResultArea",proof.proof);
        return proof.proof;
    } catch (e) {
        show("proveArea", "Oh 💔 : " + e);
    }
}

var verify = async () => {
    try {
        show('verifyArea', 'Verifying proof... ⌛');
        const isValid = await backend.verifyProof(proof);
        show("verifyArea", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);
        return isValid;
    } catch (e) {
        show("verifyArea", "Oh 💔 : " + e);
    }
}

var proof = null;
var verified = null;


const showHelpOverlay = () => {

}
const showScorecard = () => {
    alert('YAY');
}

document.getElementById('proveButton').addEventListener('click', async ()=> {
    proof = await prove();
    if (proof) {
        document.getElementById('proofArea').textContent = proof;
        document.getElementById('proveButton').setAttribute('disabled', 'true');
        document.getElementById('nextButton1').removeAttribute('disabled');
    }
});

document.getElementById('verifyButton').addEventListener('click', async ()=> {
    verified = await verify();
    if (verified) {
        document.getElementById('verifyButton').setAttribute('disabled', 'true');
        showScorecard();
    }
});


/*document.getElementById("proveButton").addEventListener("click", async () => {
    try {
        //show("proveArea", "Oh 💔 : " + e);
        const noir = new Noir(circuit);
        const backend = new UltraHonkBackend(circuit.bytecode);
        const move_count = ms.length;
        const init_grid = p.init_position;
        const move_array = new Array(1024).fill(0);
        for (let m of ms) {
            move_array.push(m);
        }
        show("proveArea", "Generating witness... ⏳");
        const { witness } = await noir.execute({ move_count, init_grid, move_array });
        show("proveArea", "Generated witness... ✅");
        show("proveArea", "Generating proof... ⏳");
        const proof = await backend.generateProof(witness);
        show("proveArea", "Generated proof... ✅");
        show("proveResultArea",proof.proof);
        document.getElementById('nextButton1').re
    } catch (e) {
        show("proveArea", "Oh 💔 : " + e);
    }
});*/

