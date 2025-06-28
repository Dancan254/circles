package main

import (
	"io"
	"log"
	"net/http"
)

func getChainlinkData(address string) ([]byte, error){
	url := "https://ccip.chain.link/api/h/atlas/transactions?first=100&offset=0&sender=" + address

	// get data from url
	resp, err := http.Get(url)
	if err != nil{
		return nil, err
	}
	defer resp.Body.Close()

	// read body
	body, err := io.ReadAll(resp.Body)
	if err != nil{
		return nil, err
	}

	return body, nil
}

func getAddressCrossChainTxn(w http.ResponseWriter, r *http.Request){
	// allow cors
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// get address from query params
	address := r.URL.Query().Get("address")

	if address == ""{
		http.Error(w, "Address is required", http.StatusBadRequest)
		return
	}

	// get cross chain txn from chainlink
	body, err := getChainlinkData(address)
	if err != nil{
		http.Error(w, "Failed to get cross chain txn", http.StatusInternalServerError)
		return
	}

	// set headers and write body
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(body)
}

func main(){
	http.HandleFunc("/api/cross-chain-txn", getAddressCrossChainTxn)

	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}