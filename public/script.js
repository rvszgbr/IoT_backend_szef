const elso = document.getElementById("elso");
const masodik = document.getElementById("masodik");
const harmadik = document.getElementById("harmadik");
const negyedik = document.getElementById("negyedik");
const kep = document.getElementById("kep");

(() => {
    setInterval(async () => {
        await sync();
    }, 1000); // 1000ms = 1 másodperc
})();

async function sync(){
    const data= await (await fetch("/numbers")).json();
    // console.log(data);
    elso.value=data[0];
    masodik.value=data[1];
    harmadik.value=data[2];
    negyedik.value=data[3];

    // be lett-e nyomnva az "s" azaz a send
    const is_checked= await (await fetch("/is_checked")).json();
    if (is_checked) {
        // egyezik-e a bevitt jelszó, az elvárttal
        const is_match= await (await fetch("/numbers/check")).json();
        // ha egyezik a jelszó, akkor kinyitjuk a széfet
        if(is_match){
            kep.src="open.jpg";
        }else{
            // nem egyezik
            alert('Hibás jelszó!');
        }
    } else{
        kep.src="close.jpg";
    }

}