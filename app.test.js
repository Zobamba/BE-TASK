import request from 'supertest';
import app from './index.js';

const encodedCredentials = Buffer.from('d1b65fc7debc3361ea86b5f14c68d2e2:13844').toString('base64');

describe('GET /', () => {
  it('GET / => List all order items', async () => {
    const response = await request(app)
      .get('/order_items')
      .set('Authorization', `Basic ${encodedCredentials}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        limit: 20,
        offset: 0,
        total: expect.any(Number),
      })
    );

    response.body.data.forEach(item => {
      expect(item).toEqual(
        expect.objectContaining({
          date: expect.any(String),

          id: expect.any(Number),

          price: expect.any(Number),

          product_category: expect.any(String),

          product_id: expect.any(String),
        })
      );
    });
  }, 20000);

  it('DELETE / => Delete an order item ID from the order items collection', async () => {
    const response = await request(app)
      .delete('/order_items/655f7cca7d034100dfd75c11')
      .set('Authorization', `Basic ${encodedCredentials}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('PUT / => Update logged in sellers city', async () => {
    const response = await request(app)
      .put('/account')
      .set('Authorization', `Basic ${encodedCredentials}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),

        seller: expect.objectContaining({
          seller_city: expect.any(String),

          seller_state: expect.any(String)
        }),
      })
    );
  });
});