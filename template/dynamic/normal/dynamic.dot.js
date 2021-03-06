<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
		<title>{{=it.nouwiki.wikiName}}: {{=it.title}}</title>

		<!-- Static -->
		<link rel="stylesheet" href="{{=it.nouwiki.markupBody}}">
		<link rel="stylesheet" href="{{=it.nouwiki.template}}/assets/static/css/template.ui.css">

		<!-- Global User Import -->
	  {{ for(var i in it.global.import) { }}
	  <link rel="import" href="{{=it.global.import[i]}}">
	  {{ } }}

	  <!-- Local User Import -->
	  {{ for(var i in it.local.import) { }}
	  <link rel="import" href="{{=it.local.import[i]}}">
	  {{ } }}

		<!-- Global User CSS -->
		{{ for(var i in it.global.css) { }}
		<link rel="stylesheet" href="{{=it.global.css[i]}}">
		{{ } }}

		<!-- Local User CSS -->
		{{ for(var i in it.local.css) { }}
		<link rel="stylesheet" href="{{=it.local.css[i]}}">
		{{ } }}
	</head>
	<body>
		<div id="controles">
	    <a href="?title=index"><button id="home">Home</button></a>
	  </div>
		<div id="content" class="markup-body">
		{{=it.fragment}}
		</div>

		<!-- Static -->
	  <script src="{{=it.nouwiki.template}}/assets/static/js/template.ui.js" async></script>

		<!-- Global User JS -->
		{{ for(var i in it.global.js) { }}
		<script class="global_js" src="{{=it.global.js[i]}}"></script>
		{{ } }}

		<!-- Local User JS -->
		{{ for(var i in it.local.js) { }}
		<script class="local_js" src="{{=it.local.js[i]}}"></script>
		{{ } }}
	</body>
</html>
