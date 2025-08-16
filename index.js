import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
//import circuit from "./circuit/target/circuit.json";
import circuit16 from "./circuit/target/circuit16.json";
import circuit64 from "./circuit/target/circuit64.json";
import circuit256 from "./circuit/target/circuit256.json";

//limit,circuit
const circuits = [
    [16, circuit16],
    [64, circuit64],
    [256, circuit256]
];

const max_moves = () => circuits[circuits.length - 1][0];

var proof = null;
var verified = null;
var prover = {
    noir: null,
    backend: null,
    proof: null
}

const show = (id, content) => {
    const container = document.getElementById(id);
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
    container.scrollTop = container.scrollHeight;};

var prove = async () => {


    try {
        const move_count = ms.length;
        const init_grid = p.init_position;

        const c = circuits.find(e => e[0] >= move_count);
        if (!c) {
            throw new Error(`move_count(${move_count}) > max_moves(${max_moves()})`);
        }
        const C_MAX = c[0];
        const circuit = c[1];

        const move_array = new Array(C_MAX);
        for (let i = 0; i < C_MAX; i++) {
            move_array[i] = i < move_count ? ({x: ms[i].x, y: ms[i].y}) : ({x:0, y:0});
            console.log(move_array[i]);
        }
        //show("proveArea", "Oh 💔 : " + e);
        prover.noir = new Noir(circuit);
        prover.backend = new UltraHonkBackend(circuit.bytecode);
       // const move_count = ms.length;
        console.log("Using circuit: " + C_MAX);
        show("proveArea", "Generating witness... ⏳");
        const { witness } = await prover.noir.execute({ move_count, init_grid, move_array });
        show("proveArea", "Generated witness... ✅");
        const startTime = Date.now();
        show("proveArea", "Start time: " + startTime + "... ⏳");
        show("proveArea", "Generating proof... ⏳");
        const proof = await prover.backend.generateProof(witness);
        const stopTime = Date.now();
        show("proveArea", "Generated proof... ✅");
        show("proveArea", "Time taken: " + Math.round((stopTime - startTime)/1000) + " seconds... ⏳");
        document.getElementById("proveResultArea").textContent = proof.proof;
        //show("proveResultArea",proof.proof);
        prover.proof = proof;
        return proof.proof;
    } catch (e) {
        show("proveArea", "Oh 💔 : " + e);
        console.error(e);
    }
}

var verify = async () => {
    try {
        show('verifyArea', 'Verifying proof... ⌛');
        const isValid = await prover.backend.verifyProof(prover.proof);
        show("verifyArea", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);
        return isValid;
    } catch (e) {
        show("verifyArea", "Oh 💔 : " + e);
        console.error(e);
        console.error(e.stack);
    }
}

const showScorecard = () => {

    const tiers = ['stier.jpg', 'atier.jpg', 'btier.jpg'];
    const move_count = ms.length;
    const index = circuits.findIndex(e => e[0] >= move_count);
    const src = tiers[index];

    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = src;
    captionText.innerHTML = "Honk";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
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
        //document.getElementById('verifyButton').setAttribute('disabled', 'true');
        setTimeout(()=>showScorecard(), 200);
    }
});

