package br.edu.ufersa.digitalist.domain.repository;

import br.edu.ufersa.digitalist.domain.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {
    Optional<Item> findById(String id);
}
