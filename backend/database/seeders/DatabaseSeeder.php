<?php

namespace Database\Seeders;

use App\Models\Pack;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin account
        User::firstOrCreate(['email' => 'admin@lechef.sn'], [
            'name'     => 'Admin Le Chef',
            'password' => Hash::make('lechef2024'),
            'role'     => 'admin',
            'phone'    => '+221338241333',
        ]);

        // Demo client
        User::firstOrCreate(['email' => 'client@test.sn'], [
            'name'     => 'Mamadou Diallo',
            'password' => Hash::make('password'),
            'role'     => 'user',
            'phone'    => '+221771234567',
        ]);

        // Products
        $products = [
            ['name' => 'Thiéboudienne Royal',    'category' => 'Plats',    'price' => 4500,  'tag' => 'Best-Seller',       'image_url' => '/images/pr1.jpg', 'description' => 'Le plat national sénégalais revisité, poisson frais, légumes du jardin, riz parfumé.'],
            ['name' => 'Yassa Poulet',            'category' => 'Plats',    'price' => 3800,  'tag' => 'Populaire',         'image_url' => '/images/pr2.jpg', 'description' => 'Poulet mariné à l\'oignon caramélisé, citron confit, olives noires.'],
            ['name' => 'Mafé Bœuf',              'category' => 'Plats',    'price' => 4200,  'tag' => null,                'image_url' => '/images/acc.jpg', 'description' => 'Ragoût de bœuf à la pâte d\'arachide, légumes fondants.'],
            ['name' => 'Brochettes Mixtes',       'category' => 'Grillades','price' => 5000,  'tag' => 'Chef recommande',   'image_url' => '/images/pr1.jpg', 'description' => 'Assortiment bœuf-agneau-poulet marinés, flambés sur charbon.'],
            ['name' => 'Salade Le Chef',          'category' => 'Entrées',  'price' => 2500,  'tag' => null,                'image_url' => '/images/pr2.jpg', 'description' => 'Roquette, tomates cerises, avocat, crevettes grillées.'],
            ['name' => 'Accra de Crevettes',      'category' => 'Entrées',  'price' => 2000,  'tag' => 'Nouveau',           'image_url' => '/images/acc.jpg', 'description' => 'Beignets croustillants de crevettes fraîches, sauce tartare.'],
            ['name' => 'Fondant Chocolat',        'category' => 'Desserts', 'price' => 1800,  'tag' => null,                'image_url' => '/images/pr1.jpg', 'description' => 'Fondant coulant, crème vanillée, éclats de praline.'],
            ['name' => 'Bissap Royal',            'category' => 'Boissons', 'price' => 800,   'tag' => 'Maison',            'image_url' => '/images/pr2.jpg', 'description' => 'Hibiscus infusé, eau de rose, menthe fraîche.'],
            ['name' => 'Poulet Rôti Maison',      'category' => 'Plats',    'price' => 4000,  'tag' => null,                'image_url' => '/images/pr1.jpg', 'description' => 'Poulet entier rôti aux herbes, accompagné de légumes de saison.'],
            ['name' => 'Jus de Gingembre',        'category' => 'Boissons', 'price' => 700,   'tag' => 'Maison',            'image_url' => '/images/pr2.jpg', 'description' => 'Jus de gingembre frais, citron, miel. Tonique naturel.'],
        ];

        foreach ($products as $p) {
            Product::firstOrCreate(['name' => $p['name']], $p);
        }

        // Packs
        $packs = [
            [
                'name' => 'Pack Express', 'subtitle' => 'Midi en vitesse',
                'price' => 5000, 'duration' => 'Servi en 20 min',
                'image_url' => '/images/pr1.jpg',
                'description' => 'Idéal pour les pauses déjeuner courtes. Rapide, savoureux, complet.',
                'items' => ['Plat du jour', 'Boisson fraîche', 'Dessert maison', 'Pain artisanal'],
            ],
            [
                'name' => 'Pack Famille', 'subtitle' => 'Partagez en famille',
                'price' => 18000, 'duration' => 'Pour 4 personnes',
                'image_url' => '/images/pr2.jpg',
                'description' => 'Le plaisir du partage. Une sélection généreuse pour toute la famille.',
                'items' => ['2 Entrées au choix', '4 Plats principaux', '4 Desserts', '4 Boissons', 'Pain garni'],
            ],
            [
                'name' => 'Pack Romantique', 'subtitle' => 'Soirée inoubliable',
                'price' => 25000, 'duration' => 'Pour 2 personnes',
                'image_url' => '/images/acc.jpg',
                'description' => 'Table décorée, bougies, ambiance tamisée. Le pack idéal pour les occasions spéciales.',
                'items' => ['Champagne d\'accueil', '2 Entrées raffinées', '2 Plats gastronomiques', 'Dessert duo', 'Déco table incluse'],
            ],
            [
                'name' => 'Pack Business', 'subtitle' => 'Déjeuner professionnel',
                'price' => 12000, 'duration' => 'Pour 2 personnes',
                'image_url' => '/images/pr1.jpg',
                'description' => 'Impressionnez vos clients dans un cadre élégant et discret.',
                'items' => ['Entrée du chef', '2 Plats signature', '2 Boissons premium', 'Café ou thé', 'Salle privée possible'],
            ],
        ];

        foreach ($packs as $pk) {
            Pack::firstOrCreate(['name' => $pk['name']], $pk);
        }
    }
}
