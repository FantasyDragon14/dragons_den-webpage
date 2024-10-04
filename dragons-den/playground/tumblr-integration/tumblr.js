//Code stolen from

/* globals hashString */

$(() => {
	$(".tmblr-iframe").remove();

	let mothblog = $("#tumblrfeed script").attr("src")
		.replace("https://", "").replace(".tumblr.com/js", "");

	$("#tumblrfeed script").remove();

	var val = $("#tumblrfeed").html();

	val = val
		.replace(/<style((.|\n)*?)>((.|\n)*?)<\/style>/g, "")
		.replace(/<script((.|\n)*?)>((.|\n)*?)<\/script>/g, "")
		.replace(/<noscript((.|\n)*?)>((.|\n)*?)<\/noscript>/g, "")
		.match(/<ol((.|\n)*?)>((.|\n)*?)<\/ol>/g, "")[0]
		;

	$("#tumblrfeed").html(val);

	$(".tumblr_caption").removeClass("tumblr_caption").addClass("tumblr_body");

	// LET'S PROCESS SOME POSTS, "BOYS" AND GIRLS!!
	$(".tumblr_body").each((i,elm) => {
		// TIME TO COOK UP SOME DELICIOUS JQUERY BULLFUCKERY
		let post = $(elm);

		// WHY IN THE FUCK WOULD YOU MAKE A PHOTO POST ISTG
		if (post.parent().hasClass("tumblr_photo_post")) {
			if (post.find(".tumblr_blog").length > 0) {
				post.find(".tumblr_blog").last()
					.parent().parent().find("blockquote").first()
					.prepend(post.parent().children(".tumblr_photo"));
			}
			else
			{
				post.prepend(post.parent().children(".tumblr_photo"));
			}
		}

		// WHAT'S IN A POST?
		//var paragraphs = post.find("p");
		var blockquotes = post.find("blockquote");
		//var mentions = post.find("img");

		// WHAT THE FUCK IS A POST?
		let op = post.find(".tumblr_blog").last().text();
		//let oplink = post.find(".tumblr_blog").last().attr("href");
		let isask = post.children("p")
			.first().text().includes("asked");

		let ischainreblog = post.children("p")
			.last().text().startsWith("(via");
		let isreblog = op != mothblog;

		console.log(`POST ${i}: {OP: ${op}, ASK: ${isask}, ISCHAINREBLOG: ${ischainreblog}, ISREBLOG: ${isreblog}}`);

		// CRUNCHIN SOME NUMBERS!!
		//let pcolor = hashString(op);

		// FORMAT ASKPOSTS
		if (isask)
		{
			let ask = post.children().slice(0,-2);
			ask.wrapAll("<div class='post-ask'></div>");

			let asker = ask.eq(0).text().split(" ")[0];
			if (asker == "Anonymous")
			{
				ask.css("color", `#657392`);
			}
			else {
				let bcolor = hashString(asker);
				ask.css("color", `hsl(${bcolor} 60% 60%)`);
				ask.find("a").css("color", `hsl(${bcolor} 60% 60%)`).prepend("@");
			}
		}

		// FORMAT REBLOGS
		if (isreblog)
		{
			if (ischainreblog) {
				let vialine = post.children("p").last();

				let link = vialine.children("a").attr("href");
				let blog = vialine.children("a").text();
				let bcolor = hashString(blog);

				vialine.remove();

				post.prepend(
					`<p style='color:hsl(${bcolor} 60% 60%);
						padding-bottom:4px;margin-bottom:4px;
						border-bottom:2px solid hsl(${bcolor} 60% 60% / 50%);'>
						ðŸ”\u{fe0e}
						<a href='${link}'
						   style='color:hsl(${bcolor} 60% 60%);'>
							@${blog}
						</a>
					</p>`
				);
			}
			else {
				//let link = post.find(".tumblr_blog").first().attr("href");
				//let blog = post.find(".tumblr_blog").first().text();
				//let bcolor = hashString(blog);

				post.prepend(
					`<p style='color: #657392;
							margin-bottom:4px'>
						ðŸ”\u{fe0e}
					</p>`
				);
			}
		}

		// PLAYING WITH MY FUCKING CRAYONS OVER HERE
		blockquotes.each((i,e) => {
			let url = $(e).parent().find(".tumblr_blog").first();
			let bcolor = hashString(url.text());

			url.css("color", `hsl(${bcolor} 60% 60%)`);
			$(e).children("p").css("color", `hsl(${bcolor} 60% 60%)`);
			$(e).css("border-color", `hsl(${bcolor} 60% 60% / 50%)`);
		});
	});

	$("#tumblrfeed").animate({opacity:1}, 200);
});
