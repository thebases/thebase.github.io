PORT ?= 8080

.PHONY: run

# Serves the site at http://localhost:$(PORT)/ (root-absolute paths need the site at the domain root).
run:
	@echo "http://localhost:$(PORT)/"
	python3 -m http.server $(PORT) --bind 127.0.0.1
