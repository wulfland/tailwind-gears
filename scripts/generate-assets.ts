import { createCanvas } from '@napi-rs/canvas'
import { mkdir, writeFile } from 'node:fs/promises'
import { products } from '../server/catalog.ts'

const directory = new URL('../public/products/', import.meta.url)
await mkdir(directory, { recursive: true })
for (const product of products) {
  const canvas = createCanvas(960, 720)
  const context = canvas.getContext('2d')
  const color = ({ 'Moss green': '#456a54', 'Cobalt blue': '#3869c5', 'Signal yellow': '#d9b72f', 'Graphite': '#373c3d', 'Chalk': '#d9d9c9', 'Rust red': '#aa5545' } as Record<string, string>)[product.color]
  context.fillStyle = '#23362919'
  context.beginPath()
  context.ellipse(480, 574, 220, 24, 0, 0, Math.PI * 2)
  context.fill()
  const surface = context.createLinearGradient(260, 160, 630, 570)
  surface.addColorStop(0, color)
  surface.addColorStop(1, product.color === 'Chalk' ? '#b2b5a4' : '#233c35')
  context.lineJoin = 'round'
  context.lineCap = 'round'
  if (product.id.includes('helmet')) {
    context.strokeStyle = '#303832'
    context.lineWidth = 20
    context.beginPath()
    context.moveTo(335, 414)
    context.lineTo(405, 566)
    context.lineTo(573, 417)
    context.moveTo(593, 400)
    context.lineTo(610, 515)
    context.lineTo(461, 548)
    context.stroke()
    context.fillStyle = '#262f2a'
    context.beginPath()
    context.ellipse(478, 423, 258, 67, -.09, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = surface
    context.beginPath()
    context.moveTo(226, 420)
    context.bezierCurveTo(217, 180, 458, 115, 635, 235)
    context.bezierCurveTo(700, 276, 737, 360, 742, 402)
    context.bezierCurveTo(598, 470, 374, 484, 226, 420)
    context.fill()
    context.strokeStyle = product.color === 'Chalk' ? '#939b89' : '#273f32'
    context.lineWidth = 23
    for (let vent = 0; vent < 5; vent++) {
      context.beginPath()
      context.moveTo(307 + vent * 70, 294 + Math.abs(vent - 2) * 17)
      context.quadraticCurveTo(326 + vent * 70, 248 + Math.abs(vent - 2) * 10, 351 + vent * 61, 249 + Math.abs(vent - 2) * 19)
      context.stroke()
    }
    context.fillStyle = '#ffffffb0'
    context.font = 'bold 19px sans-serif'
    context.fillText('TG', 583, 395)
  } else if (product.id.includes('bottle')) {
    context.fillStyle = surface
    context.beginPath()
    context.roundRect(365, 230, 230, 338, [36, 36, 43, 43])
    context.fill()
    context.fillStyle = color
    context.beginPath()
    context.roundRect(388, 195, 184, 70, 24)
    context.fill()
    context.fillStyle = '#252f2b'
    context.beginPath()
    context.roundRect(384, 171, 192, 46, 12)
    context.fill()
    context.fillStyle = '#424c43'
    context.beginPath()
    context.roundRect(451, 139, 58, 36, 9)
    context.fill()
    context.fillStyle = '#ffffff14'
    context.fillRect(389, 280, 13, 229)
    context.fillStyle = '#f5f7e9'
    context.font = 'bold 48px sans-serif'
    context.fillText('TG', 444, 398)
    context.font = '15px sans-serif'
    context.fillText('TAILWIND', 439, 428)
    context.strokeStyle = '#ffffff22'
    context.lineWidth = 3
    for (const height of [476, 490, 504]) {
      context.beginPath()
      context.moveTo(416, height)
      context.lineTo(549, height)
      context.stroke()
    }
  } else if (product.id === 'field-pannier' || product.id === 'frame-bag') {
    context.fillStyle = '#29332d'
    context.beginPath()
    context.roundRect(319, 200, 32, 95, 8)
    context.roundRect(614, 200, 32, 95, 8)
    context.fill()
    context.fillStyle = surface
    context.beginPath()
    if (product.id === 'field-pannier') {
      context.moveTo(281, 248)
      context.lineTo(682, 248)
      context.lineTo(646, 556)
      context.quadraticCurveTo(480, 585, 317, 549)
    } else {
      context.moveTo(229, 273)
      context.lineTo(731, 273)
      context.lineTo(645, 551)
      context.lineTo(350, 521)
    }
    context.closePath()
    context.fill()
    context.fillStyle = color
    context.beginPath()
    context.roundRect(product.id === 'field-pannier' ? 272 : 225, 232, product.id === 'field-pannier' ? 419 : 514, 67, 16)
    context.fill()
    context.fillStyle = '#29332d'
    context.fillRect(459, 242, 36, 192)
    context.fillStyle = '#535c51'
    context.beginPath()
    context.roundRect(452, 344, 50, 64, 6)
    context.fill()
    context.strokeStyle = '#ffffff3d'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(346, 459)
    context.lineTo(611, 459)
    context.stroke()
    context.fillStyle = '#f5f7e9'
    context.font = 'bold 24px sans-serif'
    context.fillText('TG', 545, 508)
  } else if (product.id === 'beam-light') {
    context.fillStyle = '#28312c'
    context.beginPath()
    context.roundRect(359, 406, 243, 127, 28)
    context.fill()
    context.fillStyle = surface
    context.beginPath()
    context.roundRect(265, 258, 425, 209, 55)
    context.fill()
    context.fillStyle = '#1b231f'
    context.beginPath()
    context.ellipse(660, 362, 68, 102, 0, 0, Math.PI * 2)
    context.fill()
    const lens = context.createRadialGradient(659, 353, 12, 660, 362, 90)
    lens.addColorStop(0, '#fffef2')
    lens.addColorStop(.45, '#d9e7e1')
    lens.addColorStop(1, '#759599')
    context.fillStyle = lens
    context.beginPath()
    context.ellipse(665, 362, 49, 79, 0, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = '#cfde75'
    context.beginPath()
    context.roundRect(384, 243, 83, 23, 8)
    context.fill()
    context.fillStyle = '#ffffffb0'
    context.font = 'bold 23px sans-serif'
    context.fillText('TG', 351, 365)
  } else {
    context.strokeStyle = surface
    context.lineWidth = 49
    context.beginPath()
    context.moveTo(353, 478)
    context.lineTo(353, 309)
    context.bezierCurveTo(353, 153, 607, 153, 607, 309)
    context.lineTo(607, 478)
    context.stroke()
    context.fillStyle = '#29332d'
    context.beginPath()
    context.roundRect(310, 460, 340, 95, 26)
    context.fill()
    context.fillStyle = color
    context.beginPath()
    context.roundRect(338, 477, 233, 58, 13)
    context.fill()
    context.fillStyle = '#d5dcd6'
    context.beginPath()
    context.arc(610, 507, 14, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = '#27342d'
    context.fillRect(607, 498, 5, 18)
  }
  await writeFile(new URL(`${product.id}.png`, directory), canvas.toBuffer('image/png'))
}
console.log(`Generated ${products.length} original product illustrations.`)