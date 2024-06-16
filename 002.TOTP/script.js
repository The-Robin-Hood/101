const secret = document.getElementById('secret');
const period = document.getElementById('period');
const digits = document.getElementById('digits');
const circle = document.querySelector("circle");
const perimeter = circle.getAttribute("r") * 2 * Math.PI;

function base32ToBytes(base32) {
    const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = '';
    for (const char of base32) {
        const val = base32Chars.indexOf(char.toUpperCase());
        if (val === -1) {
            throw new Error("Invalid Base32 character");
        }
        bits += val.toString(2).padStart(5, '0');
    }
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        const byte = bits.substring(i, i + 8);
        if (byte.length === 8) {
            bytes.push(parseInt(byte, 2));
        }
    }
    return new Uint8Array(bytes);
}

// Helper function to convert integer to byte array
function intToBytes(num) {
    const bytes = new Uint8Array(8);
    for (let i = 7; i >= 0; i--) {
        bytes[i] = num & 0xff;
        num = num >> 8;
    }
    return bytes;
}

// HMAC-SHA1 function using Web Crypto API
async function hmacSha1(key, message) {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
    return new Uint8Array(signature);
}

async function generateTOTP({
    seed,
    timePeriod,
    length
}) {
    const key = base32ToBytes(seed);
    const epoch = Math.floor(Date.now() / 1000);
    const time = Math.floor(epoch / timePeriod);
    const timeBytes = intToBytes(time);
    const hmac = await hmacSha1(key, timeBytes);

    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary = (
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff)
    );

    const otp = binary % 10 ** length;
    return otp.toString().padStart(length, '0');
}

async function setTOTP() {
    const timeRemaining = (period.value - (Date.now() / 1000) % period.value).toFixed(0);
    if (timeRemaining <= 0) {
        return;
    }
    const otp = await generateTOTP({
        seed: secret.value,
        timePeriod: period.value,
        length: digits.value
    });
    document.getElementById('otp').innerText = otp;
    document.getElementBy
}

secret.addEventListener('input', async (e) => {
    e.target.value = e.target.value.toUpperCase();
    await setTOTP();
});

period.addEventListener('input', async (e) => {
    if (e.target.value < 3) {
        e.target.value = 3;
    }
    await setTOTP();
});

digits.addEventListener('input', async (e) => {
    if (e.target.value < 1) {
        e.target.value = 1;
    }
    if (e.target.value > 10) {
        e.target.value = 10;
    }
    await setTOTP();
});

function updateCircle() {
    const timeRemaining = (period.value - (Date.now() / 1000) % period.value).toFixed(0);
    circle.setAttribute(
        "stroke-dashoffset",
        (perimeter * timeRemaining) / period.value - perimeter
    );
    document.getElementById("remaining").innerText = `Remaining: ${timeRemaining}s`;
}

updateCircle()
setTOTP()
setInterval(() => { updateCircle(); setTOTP() }, 1000);