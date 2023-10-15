<template>
    <div>
        <button @click="addCategory">Add Category</button>
    </div>
</template>

<script>
export default {
    methods: {
        addCategory() {
            let categoryName = prompt('Enter category name:')
            if (categoryName) {
                fetch('http://localhost:3000/category', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: categoryName }),
                })
                .then(response => response.json())
                .then(data => console.log(data))
                .then(error => console.error(error))
            }
        }
    }
}
</script>