import OrderItemController from '../controller/order-items-controller.js'
import authMiddleware from '../middleware/auth-middleware.js'

export default function orderItemRoute (app) {
  app.get('/order_items', authMiddleware, OrderItemController.getAllOrderItems)
  app.delete('/order_items/:id', authMiddleware, OrderItemController.deleteOrderItem)
  app.put('/account', authMiddleware, OrderItemController.updateSeller)
}
