const actionsLines = document.querySelectorAll(
	'.AudioPlaylistSnippet__actions'
);

const exportTxt = () => {
	(async () => {
		const scroll = (top) => window.scrollTo({ top });
		const delay = (ms) => new Promise((r) => setTimeout(r, ms));

		async function scrollPlaylist() {
			const spinner = document.querySelector('.CatalogBlock__autoListLoader');
			let pageHeight = 0;
			do {
				pageHeight = document.body.clientHeight;
				scroll(pageHeight);
				await delay(400);
			} while (
				pageHeight < document.body.clientHeight ||
				spinner?.style.display === ''
			);
		}

		function parsePlaylist() {
			return [...document.querySelectorAll('.audio_row__performer_title')].map(
				(row) => {
					const [artist, title] = [
						'.audio_row__performers',
						'.audio_row__title',
					]
						.map((selector) => row.querySelector(selector)?.textContent || '')
						.map((v) => v.replace(/[\s\n ]+/g, ' ').trim());

					return [artist, title].join(' - ');
				}
			);
		}

		function saveToFile(filename, content) {
			const data = content.replace(/\n/g, '\r\n');
			const blob = new Blob([data], { type: 'text/plain' });
			const link = document.createElement('a');
			link.download = filename;
			link.href = URL.createObjectURL(blob);
			link.target = '_blank';
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		// getting playlist name & author
		const playlistAuthor = document
			.querySelector('.AudioPlaylistSnippet__author')
			.textContent.trim();

		const playlistName = document
			.querySelector('.AudioPlaylistSnippet__title--main')
			.textContent.trim();

		// main
		await scrollPlaylist();
		const list = parsePlaylist();
		saveToFile(`${playlistAuthor} - ${playlistName}`, list.join('\n'));
	})();
};

// creating the button
const exportBtn = document.createElement('span');
exportBtn.textContent = '.txt';
exportBtn.onclick = exportTxt;
// styling the button
exportBtn.style.display = 'flex';
exportBtn.style.alignItems = 'center';
exportBtn.style.cursor = 'pointer';
exportBtn.style.color = '#939393';
exportBtn.style.fontWeight = '500';

// append the button as a child to elements
for (let i = 0; i < actionsLines.length; i++) {
	actionsLines[i].appendChild(exportBtn);
}

// big thanks to https://github.com/fivemru/ <3
