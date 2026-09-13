import * as THREE from 'three';

export class Map {
    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.createTerrain();
    }

    private createTerrain(): void {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x90EE90,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Buildings
        this.createBuilding(new THREE.Vector3(-30, 0, -40), 20, 15, 10);
        this.createBuilding(new THREE.Vector3(30, 0, -40), 20, 15, 10);
        this.createBuilding(new THREE.Vector3(-30, 0, 40), 15, 12, 15);
        this.createBuilding(new THREE.Vector3(30, 0, 40), 15, 12, 15);
        this.createBuilding(new THREE.Vector3(0, 0, 0), 10, 8, 10);

        // Trees
        this.createTree(new THREE.Vector3(-50, 0, -50));
        this.createTree(new THREE.Vector3(50, 0, -50));
        this.createTree(new THREE.Vector3(-50, 0, 50));
        this.createTree(new THREE.Vector3(50, 0, 50));
    }

    private createBuilding(
        position: THREE.Vector3,
        width: number,
        height: number,
        depth: number
    ): void {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B7355 });
        const building = new THREE.Mesh(geometry, material);
        building.position.copy(position);
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        this.scene.add(building);
    }

    private createTree(position: THREE.Vector3): void {
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.copy(position);
        trunk.position.y = 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        this.scene.add(trunk);

        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(3, 8, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.copy(position);
        foliage.position.y = 6;
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        this.scene.add(foliage);
    }
}
