#!/bin/bash

ENDPOINT_FILE="./current_endpoint.txt"
DEFAULT_ENDPOINT="http://monapi.default.com"

set_endpoint() {
    if [ $# -ne 1 ]; then
        echo "Usage: $0 set <endpoint>"
        exit 1
    fi

    local new_endpoint="$1"
    if curl -o /dev/null -s -w "%{http_code}" "$new_endpoint" | grep -q "200"; then
        echo "$new_endpoint" > "$ENDPOINT_FILE"
        echo "Nouvel endpoint défini : $new_endpoint"
    else
        echo "Erreur: L'endpoint ne répond pas avec un statut 200. Garder l'endpoint par défaut."
    fi
}

make_request() {
    if [ $# -lt 2 ]; then
        echo "Usage: $0 req <-get or -post or -put or -patch or -delete> [suite de l'url] [-m \"body\" or -f file.json]"
        exit 1
    fi

    local method="$1"
    shift
    local url_suffix="$1"
    shift
    local endpoint=$(cat "$ENDPOINT_FILE" 2>/dev/null || echo "$DEFAULT_ENDPOINT")
    local curl_opts="-X ${method:1} ${endpoint}${url_suffix}"

    while [ $# -gt 0 ]; do
        case "$1" in
            -m)
                shift
                curl_opts+=" -d '$1'"
                ;;
            -f)
                shift
                curl_opts+=" -d @'$1'"
                ;;
            *)
                ;;
        esac
        shift
    done

    echo "Requête: curl $curl_opts"
    eval "curl $curl_opts"
}

show_help() {
    echo "apiCli - Un script pour interagir avec une API HTTP."
    echo "Usage:"
    echo "    $0 set <endpoint>               Définir un nouvel endpoint."
    echo "    $0 req <méthode> <url> [-m \"body\" ou -f fichier.json] Effectuer une requête HTTP."
    echo "    <méthode> peut être -get, -post, -put, -patch, ou -delete."
    echo "    -m \"body\" pour saisir directement le body de la requête."
    echo "    -f fichier.json pour utiliser le contenu d'un fichier comme body de la requête."
    echo "    $0 help                        Afficher ce message d'aide."
}

if [ $# -lt 1 ]; then
    echo "Erreur: Aucune commande spécifiée."
    show_help
    exit 1
fi

command="$1"
shift
case $command in
    set)
        set_endpoint "$@"
        ;;
    req)
        make_request "$@"
        ;;
    help)
        show_help
        ;;
    *)
        echo "Erreur: Commande inconnue."
        show_help
        exit 1
        ;;
esac
