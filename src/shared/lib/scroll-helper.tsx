export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, c - c / 8)
  }
}

export const scrollToHeadingById = (id: string, yOffset = -80) => {
  const el = document.getElementById(id)
  if (!el) {
    console.warn(`⚠️ Element with id '${id}' not found.`)
    return
  }

  const y = el.getBoundingClientRect().top + window.scrollY + yOffset
  window.scrollTo({ top: y, behavior: 'smooth' })
}
