/**
 * MANUAL TEST PARA PLAN SAVING - SEM NECESSIDADE DE TOKEN
 * 
 * Como testar o endpoint de guardar plano:
 * 
 * 1. Abra a aplicação no browser (http://localhost:5173)
 * 2. Faça login na aplicação
 * 3. Vá para a página de Nutrição
 * 4. Abra o DevTools (F12)
 * 5. Vá ao separador Network
 * 6. Gere um plano de nutrição (ex: "quero um plano de 2000 calorias")
 * 7. Clique no botão "Guardar Plano"
 * 8. No Network, procure pela requisição POST /api/nutrition-plans
 * 9. Verifique o Status (deve ser 200 ou 201)
 * 10. Verifique a Response (deve ter o plan com ID)
 * 
 * OU use este script de teste via API com um token real:
 */

async function testWithRealUser() {
  const response = await fetch('http://localhost:3000/api/nutrition-plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (await firebase.auth().currentUser.getIdToken())
    },
    body: JSON.stringify({
      plan: {
        title: 'Teste',
        meals: [],
        macros: { totalCalories: 2000 }
      },
      message: 'Teste de plano'
    })
  });
  
  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', data);
}

// Execute na console do browser:
// testWithRealUser()
