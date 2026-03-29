package com.bativio.api.repository;

import com.bativio.api.entity.DevisReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DevisReplyRepository extends JpaRepository<DevisReply, UUID> {
    List<DevisReply> findByDemandeDevisIdOrderByCreatedAtAsc(UUID demandeDevisId);
}
