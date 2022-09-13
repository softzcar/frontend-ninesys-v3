# llamada asincrona

const data = new URLSearchParams()
data.set('data1', this.var1)
data.set('data2', this.fvar2)

let conf = {
url: '/lourlgin',
method: 'method',
data: data,
}

this.ozhttp(conf).then(()=> {
// acciones
})
