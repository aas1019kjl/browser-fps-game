import * as THREE from 'three';
import { Player } from './player';
import { Enemy } from './enemy';
import { Map } from './map';
import { InputManager } from './input';

export class Game {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private player!: Player;
    private enemies: Enemy[] = [];
    private inputManager!: InputManager;
    private map!: Map;
    private clock: THREE.Clock = new THREE.Clock();
    private gameRunning = true;

    constructor() {
        this.initThree();
        this.inputManager = new InputManager();
    }

    private initThree(): void {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 1000, 2000);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        document.getElementById('gameContainer')?.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Initialize game components
        this.map = new Map(this.scene);
        this.player = new Player(this.camera, this.inputManager);
        this.scene.add(this.player.getGroup());

        this.spawnEnemies();
    }

    private spawnEnemies(): void {
        for (let i = 0; i < 5; i++) {
            const enemy = new Enemy(
                new THREE.Vector3(
                    Math.random() * 100 - 50,
                    5,
                    Math.random() * 100 - 50
                ),
                this.player
            );
            this.enemies.push(enemy);
            this.scene.add(enemy.getGroup());
        }
    }

    public start(): void {
        this.animate();
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        const deltaTime = this.clock.getDelta();

        // Update player
        this.player.update(deltaTime, this.map);

        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);

            // Check collision with bullets
            const bullets = this.player.getBullets();
            bullets.forEach((bullet, bulletIndex) => {
                const distance = enemy.getPosition().distanceTo(bullet.position);
                if (distance < 5) {
                    // Enemy hit
                    this.scene.remove(enemy.getGroup());
                    this.enemies = this.enemies.filter(e => e !== enemy);
                    bullets.splice(bulletIndex, 1);

                    // Spawn new enemy
                    const newEnemy = new Enemy(
                        new THREE.Vector3(
                            Math.random() * 100 - 50,
                            5,
                            Math.random() * 100 - 50
                        ),
                        this.player
                    );
                    this.enemies.push(newEnemy);
                    this.scene.add(newEnemy.getGroup());
                }
            });
        });

        // Remove bullets that are too far away
        this.player.cleanupBullets();

        // Update HUD
        this.updateHUD();

        // Render
        this.renderer.render(this.scene, this.camera);
    };

    private updateHUD(): void {
        const healthDisplay = document.getElementById('healthDisplay');
        const ammoDisplay = document.getElementById('ammoDisplay');

        if (healthDisplay) {
            healthDisplay.textContent = `Health: ${this.player.getHealth()}`;
        }

        if (ammoDisplay) {
            const currentAmmo = this.player.getCurrentAmmo();
            const totalAmmo = this.player.getTotalAmmo();
            ammoDisplay.textContent = `Ammo: ${currentAmmo}/${totalAmmo}`;
        }
    }

    public onWindowResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
