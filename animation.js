const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Hebrew words to display
const words = ['שלום', 'עולם', 'אהבה', 'חיים', 'שמחה', 'חלום', 'תקווה', 'אושר', 'חברות', 'אמונה', 'תקווה', 'שמחה', 'חיים', 'אהבה', 'שלום', 'עולם'];

// Word class
class BouncingWord {
    constructor() {
        this.word = words[Math.floor(Math.random() * words.length)];
        this.x = Math.random() * (canvas.width - 100);
        this.y = Math.random() * (canvas.height - 50);
        this.dx = (Math.random() - 0.5) * 8;
        this.dy = (Math.random() - 0.5) * 8;
        this.fontSize = Math.random() * 30 + 20;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        this.width = 0; // Will be set in draw method
        this.height = 0; // Will be set in draw method
        this.lastCollision = 0; // To prevent multiple collisions in the same frame
    }

    draw() {
        ctx.font = `${this.fontSize}px Arial`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.word, this.x, this.y);
        
        // Update width and height for collision detection
        const metrics = ctx.measureText(this.word);
        this.width = metrics.width;
        this.height = this.fontSize;
    }

    checkCollision(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    update() {
        // Bounce off walls
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.dx = -this.dx;
            this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }
        if (this.y <= this.height || this.y >= canvas.height) {
            this.dy = -this.dy;
            this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create multiple bouncing words
const bouncingWords = Array.from({ length: 10 }, () => new BouncingWord());

// Victory message function
function showVictoryMessage() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('גל אתה הכי טוב!', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('You reached 2000 words!', canvas.width / 2, canvas.height / 2 + 50);
}

let isGameOver = false;

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isGameOver) {
        // First update all words
        bouncingWords.forEach(word => word.update());
        
        // Then check for collisions
        const currentTime = Date.now();
        for (let i = 0; i < bouncingWords.length; i++) {
            for (let j = i + 1; j < bouncingWords.length; j++) {
                if (bouncingWords[i].checkCollision(bouncingWords[j]) && 
                    currentTime - bouncingWords[i].lastCollision > 500 && // Prevent multiple collisions in 500ms
                    currentTime - bouncingWords[j].lastCollision > 500) {
                    
                    // Create a new word at a random position
                    const newWord = new BouncingWord();
                    newWord.x = Math.random() * (canvas.width - 100);
                    newWord.y = Math.random() * (canvas.height - 50);
                    bouncingWords.push(newWord);
                    
                    // Update collision timestamps
                    bouncingWords[i].lastCollision = currentTime;
                    bouncingWords[j].lastCollision = currentTime;
                    
                    // Check if we've reached 2000 words
                    if (bouncingWords.length >= 2000) {
                        isGameOver = true;
                        showVictoryMessage();
                        return;
                    }
                }
            }
        }
    } else {
        showVictoryMessage();
    }
    
    requestAnimationFrame(animate);
}

animate(); 