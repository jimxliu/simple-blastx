import random
from Bio import Entrez, SeqIO
from Bio.SeqRecord import SeqRecord

def query(dna_seq: str) -> list:
    '''
    Find target gene sequences that contain the query sequence
    '''
    if not dna_seq:
        return None
    results = []    
    for gene in get_target_genes():
        start = gene.seq.find(dna_seq) # Match start index
        if start >= 0:
            result = {
                'start': start,
                'name': gene.name,
                'description': gene.description  
            }
            results.append(result)
    return results

def get_target_genes() -> list:
    '''
    Return a list of target gene records
    '''
    id_list = get_target_ids()
    random.shuffle(id_list) # Randomly shuffle the list
    seq_list = []
    try:
        Entrez.email = 'xinzhou@ginkgo.com'
        handle = Entrez.efetch(db="nucleotide", id=id_list, rettype="gb", retmode="text") 
        records =  SeqIO.parse(handle, format="gb") 
        seq_list = list(records)
        handle.close()
    except Exception as err:
        print(err)
    return seq_list

def get_target_ids() -> list:
    '''
    Target gene accession IDs
    '''
    return [ 
        "NC_000852", 
        "NC_007346", 
        "NC_008724", 
        "NC_009899", 
        "NC_014637", 
        "NC_020104", 
        "NC_023423", 
        "NC_023640", 
        "NC_023719",
        "NC_027867"
    ]
    


