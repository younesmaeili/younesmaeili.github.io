document.addEventListener('DOMContentLoaded', () => {
    // Theme management
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');

    const setTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    };

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Pagination
    const postsContainer = document.getElementById('blog-posts');
    if (postsContainer) {
        const posts = Array.from(postsContainer.getElementsByClassName('blog-post'));
        const postsPerPage = 20;
        let currentPage = 1;

        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        const pageNumbersContainer = document.getElementById('page-numbers');

        function displayPosts() {
            const startIndex = (currentPage - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            posts.forEach((post, index) => {
                post.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
            });
            updatePaginationControls();
        }

        function createPageButton(pageNumber) {
            const pageButton = document.createElement('button');
            pageButton.textContent = pageNumber;
            pageButton.className = `px-3 py-1 rounded-lg font-semibold transition-colors duration-200 ${currentPage === pageNumber ? 'bg-teal-700 text-white' : 'text-teal-700 dark:text-teal-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`;
            pageButton.addEventListener('click', () => {
                currentPage = pageNumber;
                displayPosts();
            });
            return pageButton;
        }

        function createEllipsis() {
            const ellipsisSpan = document.createElement('span');
            ellipsisSpan.textContent = '...';
            ellipsisSpan.className = 'px-3 py-1 text-gray-500 dark:text-gray-400';
            return ellipsisSpan;
        }

        function updatePaginationControls() {
            const totalPages = Math.ceil(posts.length / postsPerPage);
            if (prevButton) prevButton.disabled = currentPage === 1;
            if (nextButton) nextButton.disabled = currentPage === totalPages;

            if (pageNumbersContainer) {
                pageNumbersContainer.innerHTML = '';

                // Show pagination only if there's more than one page
                if (totalPages <= 1) {
                    prevButton.style.display = 'none';
                    nextButton.style.display = 'none';
                    return;
                } else {
                    prevButton.style.display = 'inline-block';
                    nextButton.style.display = 'inline-block';
                }

                const maxPagesToShow = 5; // Total page buttons to show (e.g., 1, 2, 3, ..., 10)
                const pagesAroundCurrent = 1; // Number of pages to show around the current page

                if (totalPages <= maxPagesToShow) {
                    for (let i = 1; i <= totalPages; i++) {
                        pageNumbersContainer.appendChild(createPageButton(i));
                    }
                } else {
                    // Always show the first page
                    pageNumbersContainer.appendChild(createPageButton(1));

                    // Show ellipsis if current page is far from the start
                    if (currentPage > pagesAroundCurrent + 2) {
                        pageNumbersContainer.appendChild(createEllipsis());
                    }

                    // Show pages around the current page
                    const startPage = Math.max(2, currentPage - pagesAroundCurrent);
                    const endPage = Math.min(totalPages - 1, currentPage + pagesAroundCurrent);

                    for (let i = startPage; i <= endPage; i++) {
                        pageNumbersContainer.appendChild(createPageButton(i));
                    }

                    // Show ellipsis if current page is far from the end
                    if (currentPage < totalPages - (pagesAroundCurrent + 1)) {
                        pageNumbersContainer.appendChild(createEllipsis());
                    }

                    // Always show the last page
                    pageNumbersContainer.appendChild(createPageButton(totalPages));
                }
            }
        }

        if (posts.length > 0) {
            displayPosts();

            if(prevButton) {
                prevButton.addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        displayPosts();
                    }
                });
            }

            if(nextButton) {
                nextButton.addEventListener('click', () => {
                    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
                        currentPage++;
                        displayPosts();
                    }
                });
            }
        } else if (document.getElementById('pagination-controls')) {
            // Hide pagination if no posts
            document.getElementById('pagination-controls').style.display = 'none';
        }
    }
});