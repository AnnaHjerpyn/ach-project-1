(function ($) {
    $(function () {
        submitGuess = (word) => {
            $.ajax({
                type: "POST",
                url: "/word-bank/random",
                contentType: "application/json",
                data: JSON.stringify({Word: word}),
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                },
                success: function (response) {
                    console.log('Guess submitted successfully:', response);
                }
            });
        };
    });
})(jQuery);

export function fetchRandomWord() {
    return fetch("/word-bank")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response error.');
            }
            return response.json();
        })
        .then(data => {
            return data.solution;
        })
        .catch(error => {
            console.error('Error fetching random word:', error);
            throw error;
        });
}
