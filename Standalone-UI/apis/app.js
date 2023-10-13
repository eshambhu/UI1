const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/api/v2/asanet/devices', (req, res) => {
    res.send([
        ['Oil Measurement', 'JK AG', '1.2.3', 'Window 11'],
        ['Wheel Alignment', 'bhagi', '1.0.0', 'Window 10'],
        ['Wheel Alignment', 'beign', '1.0.3', 'Window 11']
    ])
})

app.get('/api/v2/db/order/list', (req, res) => {
    res.send([
      {id:1,orderNo:'1234',dealerNo:465757,orderDate:'01-01-2023',licencePlate:'vfddfd',createdAt:'06-01-2023'},
      {id:2,orderNo:'45646',dealerNo:'asdsadgg',orderDate:'02-01-2023',licencePlate:'ghgh',createdAt:'03-01-2023'},
      {id:3,orderNo:'3434',dealerNo:'asdasd',orderDate:'03-01-2023',licencePlate:'sdfds',createdAt:'08-01-2023'},
      {id:4,orderNo:'23223',dealerNo:'hjftj',orderDate:'04-01-2023',licencePlate:'vnvc',createdAt:'06-01-2023'}
  ])
})

app.get('/api/v2/db/pdf-report/list', (req, res) => {
    res.send([
      {id:1,orderNo:'1234',filename:'test.pdf',licencePlate:'vfddfd',createdAt:'06-01-2023'},
      {id:2,orderNo:'45646',filename:'test2.pdf',licencePlate:'ghgh',createdAt:'03-01-2023'},
  ])
})

app.get('/api/v2/db/order/statistic', (req, res) => {
  res.send({
    labels:['2023-01-04','2023-01-05','2023-01-06','2023-01-07','2023-01-08','2023-01-09'],
    dataPoints:[213,10,101,405,13,99]
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})