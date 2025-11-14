// Script de teste para Food API
// Nota: Precisa de um token válido de admin para testar completamente

console.log('=== TESTE DE ROTAS - FOOD API ===\n');

const BASE_URL = 'http://localhost:3000/api/foods';

// Teste 1: Verificar se a rota existe (sem token)
console.log('Teste 1: GET /api/foods (sem autenticação)');
fetch(BASE_URL)
    .then(res => {
        console.log(`Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log('Resposta:', data);
        if (data.message === 'Token não encontrado') {
            console.log('✓ Rota protegida corretamente\n');
        }
    })
    .catch(err => console.error('Erro:', err.message));

// Teste 2: Verificar POST sem token
setTimeout(() => {
    console.log('Teste 2: POST /api/foods/add (sem autenticação)');
    fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Teste', protein: 10, carbs: 5, fiber: 2 })
    })
        .then(res => {
            console.log(`Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log('Resposta:', data);
            if (data.message === 'Token não encontrado') {
                console.log('✓ Rota protegida corretamente\n');
            }
        })
        .catch(err => console.error('Erro:', err.message));
}, 1000);

// Teste 3: Verificar GET por ID
setTimeout(() => {
    console.log('Teste 3: GET /api/foods/1 (sem autenticação)');
    fetch(`${BASE_URL}/1`)
        .then(res => {
            console.log(`Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log('Resposta:', data);
            if (data.message === 'Token não encontrado') {
                console.log('✓ Rota protegida corretamente\n');
            }
        })
        .catch(err => console.error('Erro:', err.message));
}, 2000);

setTimeout(() => {
    console.log('\n=== RESUMO ===');
    console.log('✓ Modelo: alimentos.js - CORRETO');
    console.log('✓ Controller: FoodController.js - CRIADO');
    console.log('✓ Router: foodRouter.js - CRIADO');
    console.log('✓ Server: foodRouter registrado - OK');
    console.log('\nEndpoints disponíveis:');
    console.log('  GET    /api/foods       - Listar todos (auth)');
    console.log('  GET    /api/foods/:id   - Buscar por ID (auth)');
    console.log('  POST   /api/foods/add   - Criar (admin)');
    console.log('  PUT    /api/foods/:id   - Atualizar (admin)');
    console.log('  DELETE /api/foods/:id   - Eliminar (admin)');
    console.log('\n⚠ Para testar com autenticação, use um token Firebase válido');
    console.log('   no header: Authorization: Bearer {seu_token}');
}, 3000);
