import { ObjectId, MongoClient } from 'mongodb'

const uri = 'mongodb+srv://onahbernardchizoba:xO8P0kAi0paVpVM4@cluster0.panhrzo.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri)

class OrderItemController {
  async getAllOrderItems (req, res) {
    try {
      await client.connect()

      const database = client.db('test')
      const orderItems = database.collection('olist_order_items')
      const product = database.collection('olist_products')

      const query = { seller_id: req.username }
      const total = await orderItems.countDocuments(query)

      const limitValue = 20
      const skipValue = 0

      const options = {
        // Sort returned documents in ascending order by price
        sort: { price: 1 },
        projection: { _id: 0, id: '$order_item_id', product_id: 1, product_category: 1, price: 1, date: '$shipping_limit_date' }
      }

      const docs = await orderItems.find(query, options).limit(limitValue).skip(skipValue).toArray()

      const productPromises = docs.map(async (doc) => {
        try {
          const query = { product_id: doc.product_id }
          const options = {
            sort: { product_category_name: 1 },
            projection: { _id: 0, product_category_name: 1 }
          }
          const productName = await product.findOne(query, options)
          return productName
        } catch (error) {
          console.log(error.name)
        }
      })

      const productNames = await Promise.all(productPromises)

      docs.forEach((doc, index) => {
        doc.product_category = productNames[index]?.product_category_name
      })

      if (docs.length === 0) {
        console.log('No documents found!')
        return res.status(404).send('No documents found')
      }

      res.status(200).send({
        data: docs,
        total,
        limit: limitValue,
        offset: skipValue
      })
    } catch (err) {
      console.error(err.name)
      res.status(500).send('Error retrieving documents')
    } finally {
      await client.close()
    }
  }

  async deleteOrderItem (req, res) {
    try {
      await client.connect()

      const database = client.db('test')
      const orderItems = database.collection('olist_order_items')

      const id = req.params.id

      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format')
      }

      const query = { _id: new ObjectId(id) }

      const result = await orderItems.deleteOne(query)

      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.')
        res.status(200).send({
          message: 'Successfully deleted one document.'
        })
      } else {
        console.log('No documents matched the query. Deleted 0 documents.')
        res.status(404).send({
          message: 'No documents matched the query. Deleted 0 documents.'
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).send('Error deleting document')
    } finally {
      await client.close()
    }
  }

  async updateSeller (req, res) {
    try {
      await client.connect()

      const database = client.db('test')
      const seller = database.collection('olist_sellers')

      const filter = { seller_id: req.username }
      const query = { seller_id: req.username }

      // const options = { upsert: true };

      const options = {
        sort: { seller_city: 1 },
        projection: { _id: 0, seller_city: 1, seller_state: 1 }
      }

      const updateDoc = {
        $set: {
          seller_city: 'Abuja'
        }
      }

      const result = await seller.updateOne(filter, updateDoc, options)

      const newSeller = await seller.findOne(query, options)

      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      )

      res.status(200).send({
        message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        seller: newSeller
      })
    } catch (error) {
      console.error(error)
      res.status(500).send('Error updating document')
    } finally {
      await client.close()
    }
  }
}

export default new OrderItemController()
