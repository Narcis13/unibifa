<template>
    <div>Lista angajamente {{ JSON.stringify(report) }}</div>
</template>

<script setup >




definePageMeta({
    layout:'rapoarte'
})


const institutie = await $fetch('/api/info/institutie')


function formatAmount(amount) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
const report = ref({})

onMounted(() => {
  // Retrieve data from localStorage
  const savedData = localStorage.getItem('tempReports')
  if (savedData) {
    report.value = JSON.parse(savedData)
    // Optional: Clean up localStorage
    localStorage.removeItem('tempReports')
  }
})
console.log('Lista angajamente',institutie,report.value)

</script>